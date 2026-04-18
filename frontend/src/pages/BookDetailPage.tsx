import { useParams } from 'react-router-dom';

export default function BookDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Könyv részletek</h1>
      <p className="text-gray-400 mt-2">ID: {id}</p>
    </div>
  );
}
