import { Subscription } from "../model/subscription.model";

const addSubscription = async (userAuthId: string) => {
  return await Subscription.create({ userAuthId, active: false });
};

const getSubscriptionByUser = async (userAuthId: string) => {
  return await Subscription.findOne({ userAuthId });
};

export { addSubscription, getSubscriptionByUser };
