import React, { useState, useEffect } from 'react';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSave: (addresses: Address[]) => void;
}

const emptyAddress: Address = { street: '', city: '', state: '', zip: '' };

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, addresses, onSave }) => {
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);

  useEffect(() => {
    setLocalAddresses(addresses.length > 0 ? addresses : [emptyAddress]);
  }, [addresses, isOpen]);

  const handleChange = (index: number, field: keyof Address, value: string) => {
    const updated = [...localAddresses];
    updated[index] = { ...updated[index], [field]: value };
    setLocalAddresses(updated);
  };

  const handleAddAddress = () => {
    setLocalAddresses([...localAddresses, emptyAddress]);
  };

  const handleRemoveAddress = (index: number) => {
    const updated = localAddresses.filter((_, i) => i !== index);
    setLocalAddresses(updated.length > 0 ? updated : [emptyAddress]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate addresses: all fields required
    for (const addr of localAddresses) {
      if (!addr.street || !addr.city || !addr.state || !addr.zip) {
        alert('Please fill all address fields.');
        return;
      }
    }
    onSave(localAddresses);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 !m-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Manage Addresses</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {localAddresses.map((address, index) => (
            <div key={index} className="border p-4 rounded relative">
              <button
                type="button"
                onClick={() => handleRemoveAddress(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                aria-label="Remove address"
              >
                &times;
              </button>
              <div className="mb-2">
                <label className="block text-sm font-medium">Street</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={e => handleChange(index, 'street', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={e => handleChange(index, 'city', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={e => handleChange(index, 'state', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Zip Code</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={e => handleChange(index, 'zip', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                />
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddAddress}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
            >
              + Add Address
            </button>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;