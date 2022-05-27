import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomComponent:React.FC = () => {
    const handleClick = async () => {
        const res = await fetch('/list');
        const data = await res.json();
        console.log(data);
    }
    return (
        <div>
            <h1 className={styles.title}>Custom Component</h1>
            <p>This is a custom component. It is used to test the custom component feature.</p>
            <Button onClick={handleClick} type="primary">按钮</Button>
        </div>
    );
};

export default CustomComponent;
