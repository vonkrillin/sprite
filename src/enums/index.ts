export enum WalletStatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    CLOSED = "CLOSED",
}

export enum WalletProviderEnum {
    BASE = "BASE",
    ALGORAND = "ALGORAND",
    TRON = "TRON",
}

export enum WalletCurrencyEnum {
    USD = "USD",
    USDC = "USDC",
    USDT = "USDT",
    ALGO = "ALGO",
    TRX = "TRX",
}

export enum TransactionStatusEnum {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum TransactionTypeEnum {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT",
}