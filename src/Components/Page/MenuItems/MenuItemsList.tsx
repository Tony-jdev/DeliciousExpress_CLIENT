import React, { useState } from "react";
import { useEffect } from "react";
import { menuItemModel } from '../../../Interfaces';
import MenuItemCard from './MenuItemCard';
import { useGetMenuItemsQuery } from '../../../Apis/menuItemApi';
import { useDispatch, useSelector } from "react-redux";
import { setMenuItem } from '../../../Storage/Redux/menuItemSlice';
import { MainLoader } from '../Common';
import { RootState } from '../../../Storage/Redux/store';
import { SD_SortTypes } from "../../../Utility/SD";

const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
];

function MenuItemsList() {
    const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryList, setCategoryList] = useState([""]);
    const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
    const dispatch = useDispatch();
    const { data, isLoading } = useGetMenuItemsQuery(null);
    const searchValue = useSelector(
        (state: RootState) => state.menuItemStore.search
    );


    useEffect(() => {
        if (!isLoading) {
            dispatch(setMenuItem(data.data));
            setMenuItems(data.data);

            const tempCategoryList = ["All"];
            data.data.forEach((item: menuItemModel) => {
                if (tempCategoryList.indexOf(item.category) === -1) {
                    tempCategoryList.push(item.category);
                }
            });

            setCategoryList(tempCategoryList);
        }
    }, [isLoading]);

    useEffect(() => {
        if (data && data.data) {
            const tempMenuArray = handleFilters(
                searchValue,
                selectedCategory,
                sortName
            );
            setMenuItems(tempMenuArray);
        }
    }, [searchValue]);

    if (isLoading) {
        return <MainLoader />
    }

    const handleCategoryClick = (i: number) => {
        const buttons = document.querySelectorAll(".custom-buttons");
        let localCategory;
        buttons.forEach((button, index) => {
            if (index === i) {
                button.classList.add("active");
                if (index === 0) {
                    localCategory = "All";
                } else {
                    localCategory = categoryList[index];
                }
                setSelectedCategory(localCategory);
                const tempArray = handleFilters(searchValue, localCategory, sortName);
                setMenuItems(tempArray);
            } else {
                button.classList.remove("active");
            }
        });
    };

    const handleSortClick = (i: number) => {
        setSortName(sortOptions[i]);
        const tempArray = handleFilters(
            searchValue,
            selectedCategory,
            sortOptions[i]
        );
        setMenuItems(tempArray);
    };

    const handleFilters = (search: string, category: string, sortType: SD_SortTypes) => {
        let tempMenuItems =
            category === "All"
                ? [...data.data]
                : data.data.filter(
                    (item: menuItemModel) =>
                        item.category.toLowerCase() === category.toLowerCase()
                );

        if (search) {
            const tempArray2 = [...tempMenuItems];
            tempMenuItems = tempArray2.filter((item: menuItemModel) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        switch (sortType) {
            case SD_SortTypes.PRICE_LOW_HIGH:
                tempMenuItems.sort((a: menuItemModel, b: menuItemModel) => a.price - b.price);
                break;
            case SD_SortTypes.PRICE_HIGH_LOW:
                tempMenuItems.sort((a: menuItemModel, b: menuItemModel) => b.price - a.price);
                break;
            case SD_SortTypes.NAME_A_Z:
                tempMenuItems.sort(
                    (a: menuItemModel, b: menuItemModel) =>
                        a.name.toUpperCase().charCodeAt(0) - b.name.toUpperCase().charCodeAt(0)
                );
                break;
            case SD_SortTypes.NAME_Z_A:
                tempMenuItems.sort(
                    (a: menuItemModel, b: menuItemModel) =>
                        b.name.toUpperCase().charCodeAt(0) - a.name.toUpperCase().charCodeAt(0)
                );
                break;
            default:
                break;
        }


        return tempMenuItems;
    };

    return (
        <div className="container row">
            <div className="my-3">
                <ul className="nav w-100 d-flex justify-content-center">
                    {categoryList.map((categoryName, index) => (
                        <li
                            className="nav-item"
                            style={{ ...(index === 0 && { marginLeft: "auto" }) }}
                            key={index}
                        >
                            <button
                                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${index === 0 && "active"
                                    } `}
                                onClick={() => handleCategoryClick(index)}
                            >
                                {categoryName}
                            </button>
                        </li>
                    ))}
                    <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
                        <div
                            className="nav-link dropdown-toggle text-dark fs-6 border"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {sortName}
                        </div>
                        <ul className="dropdown-menu">
                            {sortOptions.map((sortType, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSortClick(index)}
                                    style={{cursor: 'pointer'}}
                                >
                                    {sortType}
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </div>
            {menuItems.length > 0 &&
                menuItems.map((menuItem: menuItemModel, index: number) => (
                    <MenuItemCard menuItem={menuItem} key={index} />
                ))
            }
        </div>
    )
}

export default MenuItemsList