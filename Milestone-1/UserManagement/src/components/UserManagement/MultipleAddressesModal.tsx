import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';

interface MultipleAddressesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MultipleAddressesModal: React.FC<MultipleAddressesModalProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsersWithMultipleAddresses();
    }
  }, [isOpen]);

  const fetchUsersWithMultipleAddresses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/multiple-addresses');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users with multiple addresses:', error);
      setUsers([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 !m-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Users with Multiple Addresses</h2>
        {users.length === 0 ? (
          <p>No users found with multiple addresses.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-auto">
            {users.map(user => (
              <div key={user._id} className="border p-4 rounded">
                <h3 className="font-semibold mb-2">{user.name} ({user.email})</h3>
                <ul className="list-disc list-inside">
                  {user.addresses && user.addresses.map((address, index) => (
                    <li key={index}>
                      {address.street}, {address.city}, {address.state} {address.zip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleAddressesModal;