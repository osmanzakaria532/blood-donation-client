import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const FundingForm = ({ amount, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is still loading. Please try again.');
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    try {
      const intentRes = await axiosSecure.post('/create-payment-intent', { amount });
      const clientSecret = intentRes.data?.clientSecret;

      if (!clientSecret) {
        throw new Error('Payment intent was not created.');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName || 'Anonymous Donor',
            email: user?.email || '',
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed.');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const fundingRes = await axiosSecure.post('/fundings', {
          userName: user?.displayName || 'Anonymous Donor',
          userEmail: user?.email,
          amount: Number(amount),
          transactionId: paymentIntent.id,
        });

        toast.success('Thank you for your fund!');
        onSuccess(fundingRes.data?.funding);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Funding amount</p>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(amount)}</p>
      </div>

      <div className="rounded-lg border border-gray-300 p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#111827',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#dc2626' },
            },
          }}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

const FundingModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const numericAmount = Number(amount);
  const validAmount = Number.isFinite(numericAmount) && numericAmount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Give Fund</h3>
            <p className="text-sm text-gray-500">Support the organization with a secure payment.</p>
          </div>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-xl hover:bg-gray-100">
            x
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-gray-700">Amount (USD)</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Enter fund amount"
          className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-red-500 focus:outline-none"
        />

        {!stripePromise ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            Add <span className="font-semibold">VITE_STRIPE_PUBLISHABLE_KEY</span> in client env to
            enable Stripe payment.
          </div>
        ) : validAmount ? (
          <Elements stripe={stripePromise}>
            <FundingForm amount={numericAmount} onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        ) : (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            Enter a valid amount to continue.
          </p>
        )}
      </div>
    </div>
  );
};

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchFundings = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get('/fundings');
        if (isMounted) {
          setFundings(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setFundings([]);
          toast.error('Failed to load fundings.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFundings();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure]);

  const totalFunding = useMemo(
    () => fundings.reduce((sum, funding) => sum + (Number(funding.amount) || 0), 0),
    [fundings],
  );

  const handleFundingSuccess = (newFunding) => {
    if (newFunding) {
      setFundings((prev) => [newFunding, ...prev]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Funding</h1>
            <p className="text-gray-500">All funds made by users are listed below.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Give Fund
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Funds</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalFunding)}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900">{fundings.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Fund Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                  Funding Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && fundings.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No funding records found.
                  </td>
                </tr>
              )}

              {!loading &&
                fundings.map((funding) => (
                  <tr key={funding._id || funding.transactionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{funding.userName}</td>
                    <td className="px-6 py-4 text-gray-700">{formatCurrency(funding.amount)}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(funding.fundedAt || funding.date)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <FundingModal onClose={() => setShowModal(false)} onSuccess={handleFundingSuccess} />
      )}
    </div>
  );
};

export default Funding;
