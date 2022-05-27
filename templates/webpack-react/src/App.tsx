import Logo from '../public/logo.png';
import CustomComponent from '@c/CustomComponent';
import './global.less';
import 'antd/dist/antd.css';
import React from 'react';

function App() {
    return (
        <div className="app">
            <CustomComponent/>
            <h1>React脚手架</h1>
            <img src={Logo} alt="" style={{ width: 500, height: 500 }} />
            <h4>
                欢迎使用React脚手架，请在package.json中配置好相关依赖，
            </h4>
            <h4>支持TypeScript</h4>
        </div>
    );
}

export default App;
