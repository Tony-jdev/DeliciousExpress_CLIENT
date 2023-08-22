import React from 'react';
import { MenuItemsList } from '../Components/Page/MenuItems';
import { Banner } from '../Components/Page/Common';

function Home() {
    return (
        <div>
            <Banner />
            <div className="container p-2">
                <MenuItemsList />
            </div>
        </div>
    )
}

export default Home;