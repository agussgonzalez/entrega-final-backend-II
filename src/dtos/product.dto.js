// dao/dto/product.dto.js
export class ProductDTO {
    constructor(product) {
        this.id = product._id; // Suponiendo que el id está en _id
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.thumbnails = product.thumbnails;
        this.code = product.code;
        this.stock = product.stock;
    }
}
