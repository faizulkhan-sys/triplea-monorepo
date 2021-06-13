export interface SaEmployerPolicyDto {
  sa_policy_id: number;

  employer_id: string;

  is_active: boolean;

  pay_cycle_start_on?: string;

  last_disbursed_on?: string;

  created_by?: string;
}
