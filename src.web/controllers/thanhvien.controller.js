const thanhvien = require('../../database/models/thanhvien');
const nhomthanhvien = require('../../database/models/nhomthanhvien');
const { ENUM } = require('../../utils/index');
const { localDate } = require('../../utils/localDate');

module.exports = {
	// Creating thanhvien
	create: async (res) => {
		try {
			return thanhvien.sequelize.transaction().then(async (t) => {
				return await thanhvien
					.create(
						{
							ngaytao: localDate(new Date()),
							nguoitao_id: res.nguoitao_id,
							tendangnhap: res.tendangnhap,
							tendaydu: res.tendaydu,
							matkhau: res.matkhau,
							nhomthanhvien_id: res.nhomthanhvien_id,
							trangthai: ENUM.ENABLE,
							email: res.email,
						},
						{ transaction: t },
					)
					.then((res) => {
						t.commit();
					})
					.catch((err) => {
						t.rollback();
						throw new Error();
					});
			});
		} catch (error) {
			throw new Error(error);
		}
	},
	// Updating thanhvien
	update: async (res) => {
		try {
			return thanhvien.sequelize.transaction().then(async (t) => {
				return await thanhvien
					.update(
						{
							matkhau: res.matkhau,
							nhomthanhvien_id: res.nhomthanhvien_id,
							email: res.email,
							tendaydu: res.tendaydu,
						},
						{
							where: {
								id: res.id,
							},
						},
						{ transaction: t },
					)
					.then(() => {
						t.commit();
					})
					.catch((err) => {
						t.rollback();
						throw new Error(err);
					});
			});
		} catch (error) {
			throw new Error(error);
		}
	},
	// get one thanhvien
	getOneUser: async (id) => {
		try {
			return await thanhvien.findOne({
				where: {
					id: id,
				},
                raw: true,
			});
		} catch (error) {
			throw new Error(error);
		}
	},
	getOne: async (id) => {
		try {
			return await thanhvien.findOne({
				where: {
					id: id,
				},
			});
		} catch (error) {
			throw new Error(error);
		}
	},
	// get many san pham
	getMany: async () => {
		try {
			return await thanhvien.findAll({
				include: [
					{
						model: nhomthanhvien,
						as: 'nhomthanhvien',
					},
				],
				where: {
					trangthai: 1,
				},
				order: [['ngaytao', 'DESC']],
			});
		} catch (error) {
			throw new Error(error);
		}
	},
	// disable thanhvien
	disable: async (id) => {
		try {
			return thanhvien.sequelize.transaction().then(async (t) => {
				return await thanhvien
					.update(
						{
							trangthai: ENUM.DISABLE,
						},
						{
							where: {
								id: id,
							},
						},
						{ transaction: t },
					)
					.then(() => {
						t.commit();
					})
					.catch((err) => {
						t.rollback();
						throw new Error(err);
					});
			});
		} catch (error) {
			throw new Error(error);
		}
	},

	getRole: async () => {
		try {
			return await nhomthanhvien.findAll();
		} catch (error) {
			throw new Error(error);
		}
	},
};