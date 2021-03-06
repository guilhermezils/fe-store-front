const initialState = []

const order_items = (state=initialState, action) => {
    switch(action.type) {
        case "FETCH_ORDER_SUCCESS":
            
              return [...action.order_items]
        case "ADD_ITEM_SUCCESS":
            return [...state, action.order_items]
        case "CLEAR_CART_SUCCESS":
             return []
        case "REMOVE_ITEM_SUCCESS":
            const newItemsList = state.filter(obj => obj.id !== action.order_items)
            return newItemsList
        default:
            return state
    }
}

export default order_items