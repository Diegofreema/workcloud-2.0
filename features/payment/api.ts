import axios, { isAxiosError } from 'axios';
import { baseUrl } from '~/utils/constants';
import { CustomerSession } from '@polar-sh/sdk/models/components/customersession.js';
import { CustomerSubscription } from '@polar-sh/sdk/models/components/customersubscription.js';
import { Checkout } from '@polar-sh/sdk/models/components/checkout.js';

export const createSession = async (id: string) => {
  try {
    const { data } = await axios.post<{ session: CustomerSession }>(
      `${baseUrl}/customer/create-session`,
      {
        userId: id,
      },
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data.message || 'Something went wrong';
      console.log(message);

      throw new Error(message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
export const cancelSubscription = async (id: string, token: string) => {
  try {
    const { data } = await axios.delete<{ subscription: CustomerSubscription }>(
      `${baseUrl}/customer/cancel-subscription?id=${id}&session=${token}`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      console.log({ error });

      let message = 'Something went wrong';

      // Handle 422 validation errors
      if (
        status === 422 &&
        responseData?.detail &&
        Array.isArray(responseData.detail)
      ) {
        message = responseData.detail[0]?.msg || message;
      }
      // Handle 404, 402, 409 errors
      else if (responseData?.detail) {
        message = responseData.detail;
      } else if (responseData?.error) {
        message = responseData.error;
      }

      console.log(message);
      throw new Error(message);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Something went wrong');
    }
  }
};

export const checkout = async ({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) => {
  try {
    const {
      data: { checkout },
    } = await axios.post<{ checkout: Checkout }>(`${baseUrl}/checkout`, {
      id: productId,
      userId,
    });
    return checkout;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;

      let message = 'Something went wrong';

      // Handle 422 validation errors
      if (
        status === 422 &&
        responseData?.detail &&
        Array.isArray(responseData.detail)
      ) {
        message = responseData.detail[0]?.msg || message;
      }
      // Handle 404, 402, 409 errors
      else if (responseData?.detail) {
        message = responseData.detail;
      } else if (responseData?.error) {
        message = responseData.error;
      }

      console.log(message);
      throw new Error(message);
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Something went wrong');
    }
  }
};
