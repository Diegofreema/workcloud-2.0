type ProductKey =
    "businessPlan"
    | "businessPlanYearly"
    | "businessPlanPro"
    | "businessPlanProYearly"
    | "enterprisePlan"
    | "enterprisePlanYearly"
    | undefined

export const isPremium = (productKey: ProductKey): boolean => {
    return productKey === 'businessPlanProYearly' || productKey === 'enterprisePlanYearly' || productKey === 'enterprisePlan' || productKey === 'businessPlan' || productKey === 'businessPlanYearly' || productKey === 'businessPlanPro';
}