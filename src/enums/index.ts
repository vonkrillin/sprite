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
    NGN = "NGN",
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

export enum PaymentStatusEnum {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum PaymentProviderEnum {
    BASE = "BASE",
    INTERSWITCH = "INTERSWITCH",
    SPRITE = "SPRITE"
    // todo: add other crypto providers 
    // when payment wallets are implemented
}