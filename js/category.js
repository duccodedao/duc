// category.js

// Hàm này sẽ được gọi bởi category.html
function categoryPage() {
    // Kế thừa tất cả các thuộc tính và phương thức từ shopData() của main.js
    // Điều này giúp chúng ta tái sử dụng toàn bộ logic giỏ hàng, modal, v.v.
    const shop = shopData();

    return {
        ...shop, // Thừa kế toàn bộ logic từ shopData
        
        categoryName: 'Đang tải...',
        
        // Ghi đè (override) lại hàm init của shopData
        init() {
            // Lấy tên danh mục từ URL
            const urlParams = new URLSearchParams(window.location.search);
            this.categoryName = decodeURIComponent(urlParams.get('name') || 'Không rõ');
            
            // Cập nhật tiêu đề trang
            document.title = `${this.categoryName} - HD Sports`;
            
            // Gọi hàm mới để tải sản phẩm theo danh mục
            this.fetchProductsByCategory();

            // Vẫn giữ lại logic khởi tạo giỏ hàng từ shopData gốc
            this.cart = JSON.parse(localStorage.getItem('cart')) || [];
            this.$watch('cart', () => this.saveCart());
        },

        // Hàm mới để truy vấn sản phẩm theo danh mục
        async fetchProductsByCategory() {
            this.isLoading = true;
            this.products = []; // Xóa sản phẩm cũ trước khi tải
            try {
                // Tạo một truy vấn đến Firestore
                const query = db.collection('products')
                    .where('category', '==', this.categoryName)
                    .orderBy('createdAt', 'desc');
                
                const snapshot = await query.get();
                
                // Gán kết quả vào mảng products
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

// Gán hàm vào window để AlpineJS có thể truy cập
window.categoryPage = categoryPage;
