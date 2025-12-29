import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { CATEGORIES, SIZES, addProduct, updateProduct } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

const ProductForm = ({ product, isEditing = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    discount: '',
    category: '',
    sizes: [] as string[],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        image: product.image,
        price: product.price.toString(),
        discount: product.discount.toString(),
        category: product.category,
        sizes: product.sizes,
      });
    }
  }, [product]);

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.image || !formData.price || !formData.category || formData.sizes.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name: formData.name,
      image: formData.image,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0,
      category: formData.category,
      sizes: formData.sizes,
    };

    if (isEditing && product) {
      updateProduct(product.id, productData);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } else {
      addProduct(productData);
      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
    }

    navigate('/admin/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        {formData.image && (
          <div className="mt-2 w-32 h-40 rounded-lg overflow-hidden border border-border">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x250?text=Invalid+URL';
              }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Available Sizes *</Label>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={formData.sizes.includes(size)}
                onCheckedChange={() => handleSizeToggle(size)}
              />
              <Label htmlFor={`size-${size}`} className="cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="hero">
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
