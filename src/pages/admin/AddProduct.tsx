import AdminSidebar from '@/components/AdminSidebar';
import ProductForm from '@/components/ProductForm';

const AddProduct = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Add Product</h1>
            <p className="text-muted-foreground mt-1">
              Create a new product listing
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-soft p-8">
            <ProductForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
