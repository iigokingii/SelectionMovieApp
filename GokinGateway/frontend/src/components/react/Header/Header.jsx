import React from 'react';
import { useSelector } from 'react-redux'; // Подключаем useSelector
import '../../../static/Header/header.css'; 
import LinkBlock from './HeaderComponents/LinkBlock';

const Header = () => {
  // Получаем данные о пользователе из Redux
  const credentials = useSelector((state) => state.credentialReducer.credentials);

  // Устанавливаем доступные ссылки в зависимости от роли
  let links = [
    { link: "/sign-up", title: "sign up" },
    { link: "/sign-in", title: "sign in" },
  ];

  if (credentials?.role === 'admin') {
    links = [
      { link: "/main", title: "main" },
      { link: "/movie-list", title: "movie list" },
      { link: "/add-movie", title: "add new film" },
      { link: "/ai-chat", title: "chat with Ai" },
      { link: "/logout", title: "logout" },
    ];
  } else if (credentials?.role === 'user') {
    links = [
      { link: "/main", title: "main" },
      { link: "/liked", title: "liked" },
      { link: "/settings", title: "settings" },
      { link: "/ai-chat", title: "chat with Ai" },
      { link: "/logout", title: "logout" },
    ];
  }

  return (
    <header className="header">
      <nav className="nav-wrapper">
        <div className="nav">
          {links.map((linkObj) => (
            <LinkBlock key={linkObj.link} link={linkObj.link} title={linkObj.title} />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
