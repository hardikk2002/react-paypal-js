import type { PayPalButtonsComponentProps } from "./paypalButtonTypes";
import type {
    CreateOrderActions,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";
import type { BraintreeClient } from "./braintree/clientTypes";
import type {
    BraintreePayPalCheckout,
    BraintreePayPalCheckoutTokenizationOptions,
} from "./braintree/paypalCheckout";

export type BraintreeActions = {
    braintree: BraintreePayPalCheckout;
};

export type CreateBillingAgreementActions = {
    braintree: BraintreePayPalCheckout;
};

export type CreateOrderBraintreeActions = CreateOrderActions &
    CreateBillingAgreementActions;

export type OnApproveBraintreeActions = OnApproveActions &
    CreateBillingAgreementActions;

export type OnApproveBraintreeData = BraintreePayPalCheckoutTokenizationOptions;

export interface BraintreePayPalButtonsComponentProps
    extends Omit<
        PayPalButtonsComponentProps,
        "createOrder" | "onApprove" | "createBillingAgreement"
    > {
    /**
     * The createOrder actions include the Braintree SDK paypalCheckoutInstance as `actions.braintree`
     */
    createOrder?: (
        data: Record<string, unknown>,
        actions: CreateOrderBraintreeActions
    ) => Promise<string>;
    /**
     * The createBillingAgreement actions include the Braintree SDK paypalCheckoutInstance as `actions.braintree`
     */
    createBillingAgreement?: (
        data: Record<string, unknown>,
        actions: CreateBillingAgreementActions
    ) => Promise<string>;
    /**
     * The onApprove actions include the Braintree SDK paypalCheckoutInstance as `actions.braintree`
     */
    onApprove?: (
        data: OnApproveBraintreeData,
        actions: OnApproveBraintreeActions
    ) => Promise<void>;
}

export type BraintreeNamespace = {
    client: BraintreeClient;
    paypalCheckout: BraintreePayPalCheckout;
};
