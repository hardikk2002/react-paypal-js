import React, { FC, ReactElement, useEffect } from "react";
import { action } from "@storybook/addon-actions";

import type { Story } from "@storybook/react";
import type { StoryContext } from "@storybook/addons/dist/ts3.9/types";
import type { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import type { CreateSubscriptionActions } from "@paypal/paypal-js/types/components/buttons";
import type {
    CreateOrderActions,
    OnApproveData,
    OnApproveActions,
} from "@paypal/paypal-js/types/components/buttons";

import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer,
    DISPATCH_ACTION,
} from "../../index";
import { getOptionsFromQueryString, generateRandomString } from "../utils";
import { ORDER_ID, APPROVE, SUBSCRIPTION } from "../constants";
import DocPageStructure from "../components/DocPageStructure";
import { InEligibleError, defaultProps } from "../commons";
import type { PayPalButtonsComponentProps } from "../../types/paypalButtonTypes";
import { getDefaultCode } from "./code";

const subscriptionOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    vault: true,
    ...getOptionsFromQueryString(),
};

const buttonSubscriptionProps = {
    createSubscription(
        data: Record<string, unknown>,
        actions: CreateSubscriptionActions
    ) {
        return actions.subscription
            .create({
                plan_id: PLAN_ID,
            })
            .then((orderId) => {
                action("subscriptionOrder")(orderId);
                return orderId;
            });
    },
    style: {
        label: "subscribe",
    },
    ...defaultProps,
};

const buttonOrderProps = () => ({
    createOrder(data: Record<string, unknown>, actions: CreateOrderActions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: "2",
                        },
                    },
                ],
            })
            .then((orderId) => {
                action(ORDER_ID)(orderId);
                return orderId;
            });
    },
    onApprove(data: OnApproveData, actions: OnApproveActions) {
        return actions.order.capture().then(function (details) {
            action(APPROVE)(details);
        });
    },
    ...defaultProps,
});

const orderOptions: PayPalScriptOptions = {
    "client-id": "test",
    components: "buttons",
    ...getOptionsFromQueryString(),
};

export default {
    id: "example/Subscriptions",
    title: "PayPal/Subscriptions",
    parameters: {
        controls: { expanded: true },
    },
    argTypes: {
        type: {
            control: "select",
            options: [SUBSCRIPTION, "capture"],
            table: {
                category: "Custom",
                type: { summary: "string" },
                defaultValue: {
                    summary: SUBSCRIPTION,
                },
            },
            description: "Change the PayPal checkout intent.",
        }
    },
    args: {
        type: SUBSCRIPTION,
    },
    decorators: [
        (Story: FC, storyArgs: { args: { type: string } }): ReactElement => {
            const uid = generateRandomString();
            return (
                <PayPalScriptProvider
                    options={{
                        ...subscriptionOptions,
                        "data-namespace": uid,
                        "data-uid": uid,
                        intent: storyArgs.args.type,
                    }}
                >
                    <div style={{ minHeight: "250px" }}>
                        <Story />
                    </div>
                </PayPalScriptProvider>
            );
        },
    ],
};

const PLAN_ID = "P-3RX065706M3469222L5IFM4I";

export const Default: FC<{ type: string; }> = ({
    type,
}) => {
    // Remember the type and amount props are received from the control panel
    const [_, dispatch] = usePayPalScriptReducer();
    const isSubscription = type === SUBSCRIPTION;
    const buttonOptions = isSubscription ? buttonSubscriptionProps
        : buttonOrderProps();
    useEffect(() => {
        dispatch({
            type: DISPATCH_ACTION.RESET_OPTIONS,
            value: type === SUBSCRIPTION ? subscriptionOptions : orderOptions,
        });
    }, [type, dispatch]);

    return (
        <PayPalButtons
            forceReRender={[type]}
            {...(buttonOptions as PayPalButtonsComponentProps)}
            style={{ label: isSubscription ? "subscribe": undefined }}
        >
            <InEligibleError />
        </PayPalButtons>
    );
};

/********************
 * OVERRIDE STORIES *
 *******************/
(Default as Story).parameters = {
    docs: {
        container: ({ context }: { context: StoryContext }) => (
            <DocPageStructure
                context={context}
                code={getDefaultCode(context.args.type)}
            />
        )
    },
};
