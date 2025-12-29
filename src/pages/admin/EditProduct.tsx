import { useParams, Navigate } from 'react-router-dom';
import { getProductById } from '@/lib/storage';
import AdminSidebar from '@/components/AdminSidebar';
import ProductForm from '@/components/ProductForm';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground mt-1">
              Update product details
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-soft p-8">
            <ProductForm product={product} isEditing />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
