// zod schema for create wallet dto
import { WalletProviderEnum } from "../../enums";
import { z } from "zod";

export const createWalletSchema = z.object({
    provider: z.enum(Object.values(WalletProviderEnum))
});

export type CreateWalletDto = z.infer<typeof createWalletSchema>;