import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// Example of associations and populate: https://mongoosejs.com/docs/populate.html
// Ganska bra förklaring https://vegibit.com/mongoose-relationships-tutorial/
// about lean https://mongoosejs.com/docs/tutorials/lean.html

// Remove the ObjectID and change to string
function changeIdType(ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;

}

const ProductSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, required: false },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    orderId: { type: Schema.ObjectId, ref: "Order", required: false },
},
    {
        timestamps: true,
        // When converting mongoose to object change the id
        toObject: {
            transform: changeIdType
        },
        toJSON: {
            transform: changeIdType
        }
    });

// Change _id to id on lean for findOneXxxx
ProductSchema.post(['findOne', 'findOneAndUpdate'], function (ret) {
    if (!ret)
        return;

    if (this.mongooseOptions().lean)
        return changeIdType(ret);

});

// Define the schema class
const ProductModel = mongoose.model("Product", ProductSchema);

// we export the constructor
export default ProductModel;