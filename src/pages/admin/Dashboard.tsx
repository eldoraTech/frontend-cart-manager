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

  // Mobile Product Card Component
  const ProductMobileCard = ({ product }: { product: Product }) => (
    <div className="bg-card rounded-xl shadow-soft p-4 space-y-3">
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
          <Badge variant="secondary" className="mt-1 text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <Badge variant="discount" className="text-xs">{product.discount}%</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {product.sizes.map((size) => (
          <Badge key={size} variant="outline" className="text-xs">
            {size}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 pt-2 border-t border-border">
        <Link to={`/admin/edit-product/${product.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(product.id)}
                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Manage your product inventory
              </p>
            </div>
            <Link to="/admin/add-product">
              <Button variant="hero" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>

          {products.length > 0 ? (
            <>
              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map((product) => (
                  <ProductMobileCard key={product.id} product={product} />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block bg-card rounded-xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="hidden lg:table-cell">Discount</TableHead>
                        <TableHead className="hidden xl:table-cell">Sizes</TableHead>
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
                          <TableCell>
                            <div>
                              <span className="font-medium block">{product.name}</span>
                              <span className="text-sm text-muted-foreground lg:hidden">
                                {product.category}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>${product.price.toFixed(2)}</span>
                              {product.discount > 0 && (
                                <Badge variant="discount" className="w-fit lg:hidden text-xs mt-1">
                                  {product.discount}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {product.discount > 0 ? (
                              <Badge variant="discount">{product.discount}%</Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="flex gap-1 flex-wrap max-w-32">
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
              </div>
            </>
          ) : (
            <div className="bg-card rounded-xl shadow-soft p-8 sm:p-12 text-center">
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
