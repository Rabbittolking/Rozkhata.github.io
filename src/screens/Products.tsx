import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../lib/utils';
import { AdBanner } from '../components/AdBanner';

export default function Products() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const products = useLiveQuery(() => db.products.orderBy('name').toArray()) || [];
  
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('pc');
  const [quantity, setQuantity] = useState('1');

  const handleEditClick = (p: any) => {
    setEditId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setUnit(p.unit || 'pc');
    setQuantity((p.quantity || 1).toString());
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName('');
    setPrice('');
    setUnit('pc');
    setQuantity('1');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || isNaN(Number(price))) return;
    
    if (editId) {
      await db.products.update(editId, {
        name,
        price: Number(price),
        unit,
        quantity: Number(quantity) || 1
      });
      setEditId(null);
    } else {
      await db.products.add({
        name,
        price: Number(price),
        unit,
        quantity: Number(quantity) || 1,
        createdAt: new Date().toISOString()
      });
    }
    
    setName('');
    setPrice('');
    setUnit('pc');
    setQuantity('1');
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full">
      <div className="px-4 flex items-center h-14 bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold ml-2">{t('manageProducts')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Add Product Form */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">{t('addProduct')}</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('productName')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Milk, Sugar, Rice"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('productPrice')}</label>
                 <input
                   type="number"
                   required
                   value={price}
                   onChange={(e) => setPrice(e.target.value)}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                 />
               </div>
               <div className="w-24">
                 <label className="text-sm font-medium text-gray-700 mb-1.5 block">Quantity</label>
                 <input
                   type="number"
                   min="0.01"
                   step="any"
                   required
                   value={quantity}
                   onChange={(e) => setQuantity(e.target.value)}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                 />
               </div>
               <div className="flex-1">
                 <label className="text-sm font-medium text-gray-700 mb-1.5 block">Unit</label>
                 <select
                   value={unit}
                   onChange={(e) => setUnit(e.target.value)}
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                 >
                   <option value="pc">Piece (pc)</option>
                   <option value="kg">Kilogram (kg)</option>
                   <option value="g">Gram (g)</option>
                   <option value="L">Liter (L)</option>
                   <option value="ml">Milliliter (ml)</option>
                   <option value="box">Box</option>
                   <option value="pkt">Packet (pkt)</option>
                 </select>
               </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!name || !price || !quantity}
                className="flex-1 bg-blue-600 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {editId ? (
                  <>
                    <Check size={20} />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    {t('addProduct')}
                  </>
                )}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 text-gray-700 font-semibold rounded-xl px-4 flex items-center justify-center hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3">{t('products')}</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {products.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                {t('noProducts')}
              </div>
            ) : (
              products.map(p => (
                <div 
                  key={p.id} 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => handleEditClick(p)}
                >
                  <div>
                    <span className="font-medium text-gray-900 block">{p.name}</span>
                    <span className="text-xs text-gray-500">Per {p.quantity || 1} {p.unit || 'pc'}</span>
                  </div>
                  <span className="font-bold text-blue-600">{formatCurrency(p.price)}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 mb-4">
            <AdBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
