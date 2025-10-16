// category.js

function categoryPage() {
    // Kế thừa tất cả các thuộc tính và phương thức từ shopData của main.js
    const shop = shopData();

    return {
        ...shop, // Thừa kế
        categoryName: 'Đang tải...',
        products: [], // Ghi đè lại mảng products chỉ cho trang này
        
        // Ghi đè lại hàm init
        init() {
            const urlParams = new URLSearchParams(window.location.search);
            this.categoryName = decodeURIComponent(urlParams.get('name') || 'Không rõ');
            document.title = `${this.categoryName} - HD Sports`;
            
            this.fetchProductsByCategory();
            this.cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.$watch('cart', () => this.saveCart());
        },

        async fetchProductsByCategory() {
            this.isLoading = true;
            this.products = [];
            try {
                const snapshot = await db.collection('products')
                    .where('category', '==', this.categoryName)
                    .orderBy('createdAt', 'desc')
                    .get();
                this.products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Lỗi tải sản phẩm theo danh mục:", error);
                alert("Không thể tải sản phẩm cho danh mục này.");
            } finally {
                this.isLoading = false;
            }
        },
    };
}
window.categoryPage = categoryPage;
