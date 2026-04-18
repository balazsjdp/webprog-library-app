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
        className="w-full sm:w-auto px-6 py-2 bg-verdigris text-snow rounded-lg text-sm font-medium hover:bg-pearl-aqua hover:text-onyx transition-colors"
      >
        Bejelentkezés a kölcsönzéshez
      </button>
    );
  }

  if (alreadyBorrowed) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-6 py-2 bg-graphite text-pearl-aqua/40 rounded-lg text-sm font-medium cursor-not-allowed border border-graphite/60"
      >
        Már kölcsönözted
      </button>
    );
  }

  if (availableCopies === 0) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-6 py-2 bg-graphite text-pearl-aqua/40 rounded-lg text-sm font-medium cursor-not-allowed border border-graphite/60"
      >
        Nem elérhető
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-verdigris font-medium text-sm">
        <span>Sikeresen kikölcsönözve!</span>
        <button
          onClick={() => navigate('/my-borrowings')}
          className="underline hover:no-underline text-pearl-aqua"
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
      className="w-full sm:w-auto px-6 py-2 bg-verdigris text-snow rounded-lg text-sm font-medium hover:bg-pearl-aqua hover:text-onyx transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {borrow.isPending ? 'Kölcsönzés…' : 'Kölcsönzés'}
    </button>
  );
}
