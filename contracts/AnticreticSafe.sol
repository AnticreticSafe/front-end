// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {
    Nox,
    euint256,
    externalEuint256
} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

contract AnticreticSafe {
    enum AgreementStatus {
        Created,
        TitleReportUploaded,
        ApprovedByParties,
        AgreementContractUploaded,
        PublicRegistryProofUploaded,
        ConfidentialAmountRegistered,
        PossessionDeliveryPending,
        Active,
        MoneyReturned,
        PropertyReturned,
        Closed,
        Disputed
    }

    struct Agreement {
        uint256 id;

        address propertyOwner;
        address occupant;

        bytes32 propertyHash;

        // Global document hashes
        bytes32 titleReportHash;          // Title Report / Alodial
        bytes32 agreementContractHash;    // Agreement Contract / Minuta
        bytes32 publicRegistryProofHash;  // Public Registry Proof / Derechos Reales
        bytes32 possessionDeliveryHash;   // Possession Delivery Act / Acta de Entrega
        bytes32 closureProofHash;         // Closure Proof / Cancelación

        // Reference to the confidential token operation, for example mint tx hash or operation hash
        bytes32 asUSDOperationHash;

        // Confidential amount handled by Nox
        euint256 encryptedAmount;
        bool amountRegistered;

        uint256 startDate;
        uint256 endDate;

        bool propertyOwnerApproved;
        bool occupantApproved;

        bool propertyOwnerConfirmedPossessionDelivery;
        bool occupantConfirmedPossessionReceived;

        bool occupantConfirmedMoneyReturned;
        bool propertyOwnerConfirmedPropertyReturned;

        AgreementStatus status;
        bool exists;
    }

    struct ViewerApproval {
        bool propertyOwnerApproved;
        bool occupantApproved;
        bool granted;
    }

    address public immutable asUSDToken;
    address public immutable deployer;

    uint256 public agreementCounter;

    mapping(uint256 => Agreement) private agreements;
    mapping(uint256 => mapping(address => ViewerApproval)) private viewerApprovals;

    bytes32 public constant DOC_TITLE_REPORT = keccak256("TITLE_REPORT_ALODIAL");
    bytes32 public constant DOC_AGREEMENT_CONTRACT = keccak256("AGREEMENT_CONTRACT_MINUTA");
    bytes32 public constant DOC_PUBLIC_REGISTRY_PROOF = keccak256("PUBLIC_REGISTRY_PROOF_DERECHOS_REALES");
    bytes32 public constant DOC_POSSESSION_DELIVERY = keccak256("POSSESSION_DELIVERY_ACT");
    bytes32 public constant DOC_CLOSURE_PROOF = keccak256("CLOSURE_PROOF_CANCELLATION");

    event AgreementCreated(
        uint256 indexed agreementId,
        address indexed propertyOwner,
        address indexed occupant,
        bytes32 propertyHash,
        uint256 startDate,
        uint256 endDate
    );

    event DocumentHashUploaded(
        uint256 indexed agreementId,
        bytes32 indexed documentType,
        bytes32 documentHash,
        address indexed uploadedBy
    );

    event AgreementApproved(
        uint256 indexed agreementId,
        address indexed approvedBy
    );

    event ConfidentialAmountRegistered(
        uint256 indexed agreementId,
        address indexed registeredBy,
        address indexed asUSDToken,
        bytes32 asUSDOperationHash
    );

    event ViewerApprovalSubmitted(
        uint256 indexed agreementId,
        address indexed viewer,
        address indexed approvedBy
    );

    event ViewerGranted(
        uint256 indexed agreementId,
        address indexed viewer
    );

    event PossessionDeliveryConfirmed(
        uint256 indexed agreementId,
        address indexed confirmedBy
    );

    event MoneyReturnedConfirmed(
        uint256 indexed agreementId,
        address indexed confirmedBy
    );

    event PropertyReturnedConfirmed(
        uint256 indexed agreementId,
        address indexed confirmedBy
    );

    event StatusChanged(
        uint256 indexed agreementId,
        AgreementStatus newStatus
    );

    event DisputeOpened(
        uint256 indexed agreementId,
        address indexed openedBy,
        bytes32 reasonHash
    );

    error AgreementDoesNotExist();
    error InvalidAddress();
    error InvalidHash();
    error InvalidDates();
    error NotParticipant();
    error OnlyPropertyOwner();
    error OnlyOccupant();
    error InvalidStatus();
    error AmountNotRegistered();
    error ViewerAlreadyGranted();

    modifier agreementExists(uint256 agreementId) {
        if (!agreements[agreementId].exists) {
            revert AgreementDoesNotExist();
        }
        _;
    }

    modifier onlyParticipant(uint256 agreementId) {
        Agreement storage agreement = agreements[agreementId];

        if (
            msg.sender != agreement.propertyOwner &&
            msg.sender != agreement.occupant
        ) {
            revert NotParticipant();
        }

        _;
    }

    modifier onlyPropertyOwner(uint256 agreementId) {
        if (msg.sender != agreements[agreementId].propertyOwner) {
            revert OnlyPropertyOwner();
        }

        _;
    }

    modifier onlyOccupant(uint256 agreementId) {
        if (msg.sender != agreements[agreementId].occupant) {
            revert OnlyOccupant();
        }

        _;
    }

    constructor(address _asUSDToken) {
        if (_asUSDToken == address(0)) {
            revert InvalidAddress();
        }

        asUSDToken = _asUSDToken;
        deployer = msg.sender;
    }

    function createAgreement(
        address occupant,
        bytes32 propertyHash,
        uint256 startDate,
        uint256 endDate
    ) external returns (uint256) {
        if (occupant == address(0)) {
            revert InvalidAddress();
        }

        if (occupant == msg.sender) {
            revert InvalidAddress();
        }

        if (propertyHash == bytes32(0)) {
            revert InvalidHash();
        }

        if (startDate >= endDate) {
            revert InvalidDates();
        }

        agreementCounter++;

        Agreement storage agreement = agreements[agreementCounter];

        agreement.id = agreementCounter;
        agreement.propertyOwner = msg.sender;
        agreement.occupant = occupant;
        agreement.propertyHash = propertyHash;
        agreement.startDate = startDate;
        agreement.endDate = endDate;
        agreement.status = AgreementStatus.Created;
        agreement.exists = true;

        emit AgreementCreated(
            agreementCounter,
            msg.sender,
            occupant,
            propertyHash,
            startDate,
            endDate
        );

        emit StatusChanged(agreementCounter, AgreementStatus.Created);

        return agreementCounter;
    }

    function uploadTitleReportHash(
        uint256 agreementId,
        bytes32 titleReportHash
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (titleReportHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.Created) {
            revert InvalidStatus();
        }

        agreement.titleReportHash = titleReportHash;
        agreement.status = AgreementStatus.TitleReportUploaded;

        emit DocumentHashUploaded(
            agreementId,
            DOC_TITLE_REPORT,
            titleReportHash,
            msg.sender
        );

        emit StatusChanged(agreementId, AgreementStatus.TitleReportUploaded);
    }

    function approveAgreement(
        uint256 agreementId
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        Agreement storage agreement = agreements[agreementId];

        if (
            agreement.status != AgreementStatus.TitleReportUploaded &&
            agreement.status != AgreementStatus.ApprovedByParties
        ) {
            revert InvalidStatus();
        }

        if (msg.sender == agreement.propertyOwner) {
            agreement.propertyOwnerApproved = true;
        }

        if (msg.sender == agreement.occupant) {
            agreement.occupantApproved = true;
        }

        emit AgreementApproved(agreementId, msg.sender);

        if (agreement.propertyOwnerApproved && agreement.occupantApproved) {
            agreement.status = AgreementStatus.ApprovedByParties;

            emit StatusChanged(
                agreementId,
                AgreementStatus.ApprovedByParties
            );
        }
    }

    function uploadAgreementContractHash(
        uint256 agreementId,
        bytes32 agreementContractHash
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (agreementContractHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.ApprovedByParties) {
            revert InvalidStatus();
        }

        agreement.agreementContractHash = agreementContractHash;
        agreement.status = AgreementStatus.AgreementContractUploaded;

        emit DocumentHashUploaded(
            agreementId,
            DOC_AGREEMENT_CONTRACT,
            agreementContractHash,
            msg.sender
        );

        emit StatusChanged(
            agreementId,
            AgreementStatus.AgreementContractUploaded
        );
    }

    function uploadPublicRegistryProofHash(
        uint256 agreementId,
        bytes32 publicRegistryProofHash
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (publicRegistryProofHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.AgreementContractUploaded) {
            revert InvalidStatus();
        }

        agreement.publicRegistryProofHash = publicRegistryProofHash;
        agreement.status = AgreementStatus.PublicRegistryProofUploaded;

        emit DocumentHashUploaded(
            agreementId,
            DOC_PUBLIC_REGISTRY_PROOF,
            publicRegistryProofHash,
            msg.sender
        );

        emit StatusChanged(
            agreementId,
            AgreementStatus.PublicRegistryProofUploaded
        );
    }

    function registerConfidentialAmount(
        uint256 agreementId,
        externalEuint256 encryptedAmountHandle,
        bytes calldata inputProof,
        bytes32 asUSDOperationHash
    )
        external
        agreementExists(agreementId)
        onlyOccupant(agreementId)
    {
        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.PublicRegistryProofUploaded) {
            revert InvalidStatus();
        }

        if (asUSDOperationHash == bytes32(0)) {
            revert InvalidHash();
        }

        euint256 amount = Nox.fromExternal(
            encryptedAmountHandle,
            inputProof
        );

        agreement.encryptedAmount = amount;
        agreement.amountRegistered = true;
        agreement.asUSDOperationHash = asUSDOperationHash;
        agreement.status = AgreementStatus.ConfidentialAmountRegistered;

        Nox.allowThis(agreement.encryptedAmount);
        Nox.allow(agreement.encryptedAmount, agreement.propertyOwner);
        Nox.allow(agreement.encryptedAmount, agreement.occupant);

        emit ConfidentialAmountRegistered(
            agreementId,
            msg.sender,
            asUSDToken,
            asUSDOperationHash
        );

        emit ViewerGranted(agreementId, agreement.propertyOwner);
        emit ViewerGranted(agreementId, agreement.occupant);

        emit StatusChanged(
            agreementId,
            AgreementStatus.ConfidentialAmountRegistered
        );
    }

    function approveAmountViewer(
        uint256 agreementId,
        address viewer
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (viewer == address(0)) {
            revert InvalidAddress();
        }

        Agreement storage agreement = agreements[agreementId];

        if (!agreement.amountRegistered) {
            revert AmountNotRegistered();
        }

        ViewerApproval storage approval = viewerApprovals[agreementId][viewer];

        if (approval.granted) {
            revert ViewerAlreadyGranted();
        }

        if (msg.sender == agreement.propertyOwner) {
            approval.propertyOwnerApproved = true;
        }

        if (msg.sender == agreement.occupant) {
            approval.occupantApproved = true;
        }

        emit ViewerApprovalSubmitted(
            agreementId,
            viewer,
            msg.sender
        );

        if (approval.propertyOwnerApproved && approval.occupantApproved) {
            approval.granted = true;

            Nox.allow(agreement.encryptedAmount, viewer);

            emit ViewerGranted(agreementId, viewer);
        }
    }

    function propertyOwnerConfirmPossessionDelivery(
        uint256 agreementId,
        bytes32 possessionDeliveryHash
    )
        external
        agreementExists(agreementId)
        onlyPropertyOwner(agreementId)
    {
        if (possessionDeliveryHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (
            agreement.status != AgreementStatus.ConfidentialAmountRegistered &&
            agreement.status != AgreementStatus.PossessionDeliveryPending
        ) {
            revert InvalidStatus();
        }

        agreement.possessionDeliveryHash = possessionDeliveryHash;
        agreement.propertyOwnerConfirmedPossessionDelivery = true;

        emit DocumentHashUploaded(
            agreementId,
            DOC_POSSESSION_DELIVERY,
            possessionDeliveryHash,
            msg.sender
        );

        emit PossessionDeliveryConfirmed(agreementId, msg.sender);

        if (agreement.occupantConfirmedPossessionReceived) {
            agreement.status = AgreementStatus.Active;
            emit StatusChanged(agreementId, AgreementStatus.Active);
        } else {
            agreement.status = AgreementStatus.PossessionDeliveryPending;
            emit StatusChanged(
                agreementId,
                AgreementStatus.PossessionDeliveryPending
            );
        }
    }

    function occupantConfirmPossessionReceived(
        uint256 agreementId
    )
        external
        agreementExists(agreementId)
        onlyOccupant(agreementId)
    {
        Agreement storage agreement = agreements[agreementId];

        if (
            agreement.status != AgreementStatus.ConfidentialAmountRegistered &&
            agreement.status != AgreementStatus.PossessionDeliveryPending
        ) {
            revert InvalidStatus();
        }

        agreement.occupantConfirmedPossessionReceived = true;

        emit PossessionDeliveryConfirmed(agreementId, msg.sender);

        if (agreement.propertyOwnerConfirmedPossessionDelivery) {
            agreement.status = AgreementStatus.Active;
            emit StatusChanged(agreementId, AgreementStatus.Active);
        } else {
            agreement.status = AgreementStatus.PossessionDeliveryPending;
            emit StatusChanged(
                agreementId,
                AgreementStatus.PossessionDeliveryPending
            );
        }
    }

    function occupantConfirmMoneyReturned(
        uint256 agreementId
    )
        external
        agreementExists(agreementId)
        onlyOccupant(agreementId)
    {
        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.Active) {
            revert InvalidStatus();
        }

        agreement.occupantConfirmedMoneyReturned = true;
        agreement.status = AgreementStatus.MoneyReturned;

        emit MoneyReturnedConfirmed(agreementId, msg.sender);
        emit StatusChanged(agreementId, AgreementStatus.MoneyReturned);
    }

    function propertyOwnerConfirmPropertyReturned(
        uint256 agreementId
    )
        external
        agreementExists(agreementId)
        onlyPropertyOwner(agreementId)
    {
        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.MoneyReturned) {
            revert InvalidStatus();
        }

        agreement.propertyOwnerConfirmedPropertyReturned = true;
        agreement.status = AgreementStatus.PropertyReturned;

        emit PropertyReturnedConfirmed(agreementId, msg.sender);
        emit StatusChanged(agreementId, AgreementStatus.PropertyReturned);
    }

    function closeAgreement(
        uint256 agreementId,
        bytes32 closureProofHash
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (closureProofHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (agreement.status != AgreementStatus.PropertyReturned) {
            revert InvalidStatus();
        }

        agreement.closureProofHash = closureProofHash;
        agreement.status = AgreementStatus.Closed;

        emit DocumentHashUploaded(
            agreementId,
            DOC_CLOSURE_PROOF,
            closureProofHash,
            msg.sender
        );

        emit StatusChanged(agreementId, AgreementStatus.Closed);
    }

    function openDispute(
        uint256 agreementId,
        bytes32 reasonHash
    )
        external
        agreementExists(agreementId)
        onlyParticipant(agreementId)
    {
        if (reasonHash == bytes32(0)) {
            revert InvalidHash();
        }

        Agreement storage agreement = agreements[agreementId];

        if (
            agreement.status == AgreementStatus.Closed ||
            agreement.status == AgreementStatus.Disputed
        ) {
            revert InvalidStatus();
        }

        agreement.status = AgreementStatus.Disputed;

        emit DisputeOpened(agreementId, msg.sender, reasonHash);
        emit StatusChanged(agreementId, AgreementStatus.Disputed);
    }

    function getAgreementCore(
        uint256 agreementId
    )
        external
        view
        agreementExists(agreementId)
        returns (
            uint256 id,
            address propertyOwner,
            address occupant,
            address token,
            uint256 startDate,
            uint256 endDate,
            bool amountRegistered,
            AgreementStatus status
        )
    {
        Agreement storage agreement = agreements[agreementId];

        return (
            agreement.id,
            agreement.propertyOwner,
            agreement.occupant,
            asUSDToken,
            agreement.startDate,
            agreement.endDate,
            agreement.amountRegistered,
            agreement.status
        );
    }

    function getAgreementHashes(
        uint256 agreementId
    )
        external
        view
        agreementExists(agreementId)
        returns (
            bytes32 propertyHash,
            bytes32 titleReportHash,
            bytes32 agreementContractHash,
            bytes32 publicRegistryProofHash,
            bytes32 possessionDeliveryHash,
            bytes32 closureProofHash,
            bytes32 asUSDOperationHash
        )
    {
        Agreement storage agreement = agreements[agreementId];

        return (
            agreement.propertyHash,
            agreement.titleReportHash,
            agreement.agreementContractHash,
            agreement.publicRegistryProofHash,
            agreement.possessionDeliveryHash,
            agreement.closureProofHash,
            agreement.asUSDOperationHash
        );
    }

    function getAgreementApprovals(
        uint256 agreementId
    )
        external
        view
        agreementExists(agreementId)
        returns (
            bool propertyOwnerApproved,
            bool occupantApproved,
            bool propertyOwnerConfirmedPossessionDelivery,
            bool occupantConfirmedPossessionReceived,
            bool occupantConfirmedMoneyReturned,
            bool propertyOwnerConfirmedPropertyReturned
        )
    {
        Agreement storage agreement = agreements[agreementId];

        return (
            agreement.propertyOwnerApproved,
            agreement.occupantApproved,
            agreement.propertyOwnerConfirmedPossessionDelivery,
            agreement.occupantConfirmedPossessionReceived,
            agreement.occupantConfirmedMoneyReturned,
            agreement.propertyOwnerConfirmedPropertyReturned
        );
    }

    function getViewerApproval(
        uint256 agreementId,
        address viewer
    )
        external
        view
        agreementExists(agreementId)
        returns (
            bool propertyOwnerApproved,
            bool occupantApproved,
            bool granted
        )
    {
        ViewerApproval storage approval = viewerApprovals[agreementId][viewer];

        return (
            approval.propertyOwnerApproved,
            approval.occupantApproved,
            approval.granted
        );
    }

    function getEncryptedAmountHandle(
        uint256 agreementId
    )
        external
        view
        agreementExists(agreementId)
        onlyParticipant(agreementId)
        returns (euint256)
    {
        Agreement storage agreement = agreements[agreementId];

        if (!agreement.amountRegistered) {
            revert AmountNotRegistered();
        }

        return agreement.encryptedAmount;
    }
}