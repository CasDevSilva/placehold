export const getDimensions = (data) => {
    let mArrDimensions = data.split("x");

    return {
        width : Number(mArrDimensions[0]),
        height: Number(mArrDimensions[1])
    };
}

export default {
    getDimensions
}