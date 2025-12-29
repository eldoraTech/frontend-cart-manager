import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '@/lib/storage';
import { Product } from '@/types/product';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Package } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setProducts(getProducts());
    toast({
      title: 'Product deleted',
      description: 'The product has been removed successfully.',
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">
                Manage your product inventory
              </p>
            </div>
            <Link to="/admin/add-product">
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="bg-card rounded-xl shadow-soft overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Sizes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.discount > 0 ? (
                          <Badge variant="discount">{product.discount}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes.slice(0, 3).map((size) => (
                            <Badge key={size} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                          {product.sizes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.sizes.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/edit-product/${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-card rounded-xl shadow-soft p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No products yet</h2>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first product
              </p>
              <Link to="/admin/add-product">
                <Button variant="hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
