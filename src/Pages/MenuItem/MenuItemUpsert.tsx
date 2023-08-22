import React from 'react';
import { useEffect, useState } from 'react';
import { inputHelper, toastNotify } from '../../Helper';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLoader } from '../../Components/Page/Common';
import { useCreateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from '../../Apis/menuItemApi';
import { SD_Categories } from '../../Utility/SD';

const Categories = [
    SD_Categories.SOUPS,
    SD_Categories.MEAT,
    SD_Categories.APPETIZERS,
    SD_Categories.PIZZA,
    SD_Categories.DESSERTS,
];

const menuItemData = {
    name: "",
    description: "",
    specialTag: "",
    category: Categories[0],
    price: "",
};


function MenuItemUpsert() {
    const { id } = useParams();

    const navigate = useNavigate();
    const [imageToStore, setImageToStore] = useState<any>();
    const [imageToDisplay, setImageToDisplay] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [createMenuItem] = useCreateMenuItemMutation();
    const [updateMenuItem] = useUpdateMenuItemMutation();
    const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
    const { data } = useGetMenuItemByIdQuery(id);

    useEffect(() => {
        console.log(data);
        if (data && data.data) {
            const tempData = {
                name: data.data.name,
                description: data.data.description,
                specialTag: data.data.specialTag,
                category: data.data.category,
                price: data.data.price,
            };
            setMenuItemInputs(tempData);
            setImageToDisplay(data.data.image);
        }
    }, [data]);

    const handleMenuItemInput = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const tempData = inputHelper(e, menuItemInputs);
        setMenuItemInputs(tempData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const imgType = file.type.split("/")[1];
            const validImgTypes = ["jpeg", "jpg", "png"];

            const isImageTypeValid = validImgTypes.filter((e) => {
                return e === imgType;
            });

            if (file.size > 1000 * 1024) {
                setImageToStore("");
                toastNotify("File Must be less then 1 MB", "error");
                return;
            } else if (isImageTypeValid.length === 0) {
                setImageToStore("");
                toastNotify("File Must be in jpeg, jpg or png", "error");
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            setImageToStore(file);
            reader.onload = (e) => {
                const imgUrl = e.target?.result as string;
                setImageToDisplay(imgUrl);
            };
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!imageToStore && !id) {
            toastNotify("Please upload an image", "error");
            setLoading(false);
            return;
        }

        const formData = new FormData();

        formData.append("Name", menuItemInputs.name);
        formData.append("Description", menuItemInputs.description);
        formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
        formData.append("Category", menuItemInputs.category);
        formData.append("Price", menuItemInputs.price);
        if (imageToDisplay) formData.append("File", imageToStore);
        
        let response;

        if (id) {
            formData.append("Id", id);
            response = await updateMenuItem({ data: formData, id });
            toastNotify("Menu Item updated successfully", "success");
        } else {
            response = await createMenuItem(formData);
            console.log(response);
            toastNotify("Menu Item created successfully", "success");
        }

        if (response) {
            setLoading(false);
            navigate("/menuItem/menuitemlist");
        }

        setLoading(false);
    };

    return (
        <div className="container border mt-5 p-5 bg-light">
            {loading && <MainLoader />}
            <h3 className=" px-2 text-success">
                {id ? "Edit Menu Item" : "Add Menu Item"}
            </h3>
            <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="row mt-3">
                    <div className="col-md-7">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            required
                            name="name"
                            value={menuItemInputs.name}
                            onChange={handleMenuItemInput}
                        />
                        <textarea
                            className="form-control mt-3"
                            placeholder="Enter Description"
                            name="description"
                            rows={10}
                            value={menuItemInputs.description}
                            onChange={handleMenuItemInput}
                        ></textarea>
                        <input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Enter Special Tag"
                            name="specialTag"
                            value={menuItemInputs.specialTag}
                            onChange={handleMenuItemInput}
                        />
                        <select
                            className="form-control mt-3 form-select"
                            placeholder="Enter Category"
                            name="category"
                            value={menuItemInputs.category}
                            onChange={handleMenuItemInput}
                        >
                            {Categories.map((category) => (
                                <option value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            className="form-control mt-3"
                            required
                            placeholder="Enter Price"
                            name="price"
                            value={menuItemInputs.price}
                            onChange={handleMenuItemInput}
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="form-control mt-3"
                        />
                        <div className="row">
                            <div className="col-6">
                                <button
                                    type="submit"
                                    className="btn btn-success form-control mt-3"
                                >
                                    {id ? "Update" : "Create"}
                                </button>
                            </div>
                            <div className="col-6">
                                <a
                                    onClick={() => navigate("/menuItem/menuitemlist")}
                                    className="btn btn-secondary form-control mt-3"
                                >
                                    Back to Menu Items
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 text-center">
                        <img
                            src={imageToDisplay}
                            style={{ width: "100%", borderRadius: "30px" }}
                            alt=""
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MenuItemUpsert