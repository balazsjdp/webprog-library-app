import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBorrowMutation } from '../../hooks/useBorrowings';
import keycloak from '../../keycloak';

interface Props {
  bookId: string;
  availableCopies: number;
  alreadyBorrowed?: boolean;
}

export default function BorrowButton({ bookId, availableCopies, alreadyBorrowed }: Props) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const borrow = useBorrowMutation();
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => keycloak.login()}
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Bejelentkezés a kölcsönzéshez
      </button>
    );
  }

  if (alreadyBorrowed) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        Már kölcsönözted
      </button>
    );
  }

  if (availableCopies === 0) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        Nem elérhető
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
        <span>Sikeresen kikölcsönözve!</span>
        <button
          onClick={() => navigate('/my-borrowings')}
          className="underline hover:no-underline"
        >
          Saját kölcsönzések
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        borrow.mutate(bookId, {
          onSuccess: () => setSuccess(true),
        });
      }}
      disabled={borrow.isPending}
      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {borrow.isPending ? 'Kölcsönzés…' : 'Kölcsönzés'}
    </button>
  );
}
