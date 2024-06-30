import * as accounts from "./accounts";
import * as users from "./users";
import * as verificationTokens from "./verification-tokens";
import * as passwordResetTokens from "./password-reset-tokens";
import * as twoFactorTokens from "./two-factor-tokens";
import * as twoFactorConfirmations from "./two-factor-confirmations";
import * as accountsRelations from "./accounts-relations";
import * as usersRelations from "./users-relations";
import * as twoFactorConfirmationsRelations from "./two-factor-confirmations-relations";
import { profiles } from "./profiles";
import { profilesRelations } from "./profiles-relations";

export const schema = {
  ...accounts,
  ...users,
  ...verificationTokens,
  ...passwordResetTokens,
  ...twoFactorTokens,
  ...twoFactorConfirmations,
  ...accountsRelations,
  ...usersRelations,
  ...twoFactorConfirmationsRelations,
  ...profiles,
  ...profilesRelations,
};
