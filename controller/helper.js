export const getData = async (Model, queryObject = {}, projection = '') => {
    try {
        const response = await Model.find(queryObject, projection);
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}

export const getDataById = async (Model, id, projection = '') => {
    try {
        const response = await Model.findById(id, projection);
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}

export const getDataByValue = async (Model, queryObject, projection = '') => {
    try {
        const response = await Model.find(queryObject, projection);
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}

export const createData = async (Model, data) => {
    try {
        const response = await Model.create(data);
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}

export const editDataById = async (Model, id, data) => {
    try {
        const response = await Model.findByIdAndUpdate(id, data, { new: true });
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}

export const deleteDataById = async (Model, id) => {
    try {
        const response = await Model.findByIdAndDelete(id);
        return { response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error };
    }
}
