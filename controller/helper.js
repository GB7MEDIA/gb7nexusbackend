export const getData = async (model, queryObject = {}, projection = '') => {
    try {
        const response = await model.find(queryObject, projection).lean();
        return response;
    } catch (error) {
        throw error;
    }
}

export const getDataByValue = async (model, queryObject = {}, projection = '') => {
    try {
        const response = await model.findOne(queryObject, projection).lean();
        return response;
    } catch (error) {
        throw error;
    }
}

export const getDataById = async (model, id, projection = '') => {
    try {
        const response = await model.findById(id, projection).lean();
        return response;
    } catch (error) {
        throw error;
    }
}

export const createData = async (model, data) => {
    try {
        const response = await model.create(data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const editDataById = async (model, id, data) => {
    try {
        const response = await model.findByIdAndUpdate(id, data, { new: true });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteDataById = async (model, id) => {
    try {
        const response = await model.findByIdAndDelete(id);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteDataByValue = async (model, queryObject = {}) => {
    try {
        const response = await model.findOneAndDelete(queryObject);
        return response;
    } catch (error) {
        throw error;
    }
}
