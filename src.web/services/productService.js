const { QueryTypes } = require('sequelize');

const Product = require('../../database/models/sanpham');
const sequelize = require('../../database/config');
const { NotFoundException, BadRequestException } = require('../../utils/api.res/api.error');
const { toNumber } = require('lodash');

const MAX_BARCODE = 3000000000000;

const nativeFindOne = (options) => {
    return Product.findOne(options);
};

const generateBarcode = async (productId) => {
    const foundProduct = await nativeFindOne({
        where: {
            id: productId,
        },
        raw: true,
        attributes: ['id', 'mavach'],
    });

    if (!foundProduct) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    if (foundProduct.mavach && foundProduct.mavach.trim()) {
        throw new BadRequestException('Sản phẩm đã có mã vạch');
    }

    let lastBarcode = MAX_BARCODE;
    const max = await sequelize.query(
        `SELECT MAX(CONVERT(mavach, SIGNED)) as mavach FROM sanpham where mavach like '3%'`,
        {
            type: QueryTypes.SELECT,
        },
    );

    if (max.length > 0) lastBarcode = max[0].mavach;
    if (lastBarcode < MAX_BARCODE) {
        lastBarcode = MAX_BARCODE;
    }

    const newBarcode = toNumber(lastBarcode) + 1;
    const productModel = {
        id: productId,
        mavach: newBarcode,
    };
    const [rowUpdated] = await Product.update(productModel, {
        where: {
            id: productModel.id,
        },
    });
    if (!rowUpdated) {
        throw new BadRequestException('Cập nhật mã vạch thất bại');
    }
    return productModel;
};

exports.generateBarcode = generateBarcode;
