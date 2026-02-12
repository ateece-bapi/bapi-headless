/**
 * Shipping Details Component
 *
 * Displays shipping and billing addresses
 */

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface ShippingDetailsProps {
  shippingAddress: Address;
  billingAddress: Address;
}

export default function ShippingDetails({ shippingAddress, billingAddress }: ShippingDetailsProps) {
  const formatAddress = (address: Address) => {
    return (
      <>
        <p className="font-semibold text-neutral-900">
          {address.firstName} {address.lastName}
        </p>
        <p className="text-neutral-600">{address.address1}</p>
        {address.address2 && <p className="text-neutral-600">{address.address2}</p>}
        <p className="text-neutral-600">
          {address.city}, {address.state} {address.postcode}
        </p>
        <p className="text-neutral-600">{address.country}</p>
      </>
    );
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-bold text-neutral-900">Shipping & Billing</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Shipping Address */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-neutral-700">
            Shipping Address
          </h3>
          <div className="space-y-1 text-sm">{formatAddress(shippingAddress)}</div>
        </div>

        {/* Billing Address */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-neutral-700">Billing Address</h3>
          <div className="space-y-1 text-sm">{formatAddress(billingAddress)}</div>
        </div>
      </div>
    </div>
  );
}
