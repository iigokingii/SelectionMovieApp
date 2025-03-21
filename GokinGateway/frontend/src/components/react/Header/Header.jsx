import React from 'react';
import { useSelector } from 'react-redux'; // Подключаем useSelector
import '../../../static/Header/header.css'; 
import LinkBlock from './HeaderComponents/LinkBlock';

const Header = () => {
  // Получаем данные о пользователе из Redux
  const credentials = useSelector((state) => state.credentialReducer.credentials);

  // Устанавливаем доступные ссылки в зависимости от роли
  let links = [
    { link: "/sign-up", title: "Регистрация" },
    { link: "/sign-in", title: "Авторизация" },
  ];

  if (credentials?.role === 'admin') {
    links = [
      { link: "/main", title: "Главная" },
      { link: "/movie-list", title: "Список фильмов" },
      { link: "/add-movie", title: "Добавить фильм" },
      { link: "/ai-chat", title: "Чат с ИИ" },
      { link: "/chat", title: "Чат с пользователями" },
      { link: "/logout", title: "Выход" },
    ];
  } else if (credentials?.role === 'user') {
    links = [
      { link: "/main", title: "Главная" },
      { link: "/liked", title: "Избранное" },
      { link: "/settings", title: "Настройки" },
      { link: "/ai-chat", title: "Чат с ИИ" },
      { link: "/quiz", title: "Квизы" },
      { link: "/subscription-form", title: "Офомить подписку" },
      { link: "/chat", title: "Чат с поддержкой" },
      { link: "/logout", title: "Выход" },
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
