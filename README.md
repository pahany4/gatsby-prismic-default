# Gatsby starter blog

## Установить глобально Gatsby CLI

    npm install -g gatsby-cli

или

    yarn add -g gatsby-cli

## Скачать стартер Gatsby в связке с Prismic

    gatsby new my-default-starter https://github.com/gatsbyjs/gatsby-starter-default

## Перейти в папку и запустить проект

    cd my-default-starter/
    gatsby develop

## Файл gatsby-config

Отредактировать файл gatsby-config в корневой директории. В разделе "siteMetadata" - раздел метатегов для SEO

    title - заголовок в шапке,
    description - описание проекта,
    siteUrl - URL по которому размещен сайт.

## Создание меню навигации

В папке src/components создаем файл menu.js cо следующим содержимым

    import React from "react";
    import {Link} from "gatsby";

    const Menu = () => {
    return (
    <div
        style={{
            background: '#f4f4f4',
            paddingTop: '10px',
        }}
    >
        <ul
            style={{
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-evenly'
            }}
        >
        <li>
            <Link to={'/'}>Home</Link>
        </li>
        <li>
            <Link to={'/blog'}>blog</Link>
        </li>
        </ul>
    </div>
    )
    }

    export default Menu

## Аккаунт и репозиторий в CMS Prismic.io

Зарегистрировать аккаунт в https://prismic.io/ по кнопке "Start building, it's free". Создать новый репозиторий по
кнопке "With another framework" и указать Gatsby. В созданном репозитории выбрать язык контента на сайте. Создать
кастомные типы по кнопке "Create custom type".

Для однотипного контента блога выбрать "Repeatable Type", указать имя, например, Post.

В следующем окне перенести из правого сайдбара в "Simply drag and drop" необходимые поля

    UID (указать Field name - uid, поле необходимое для роутинга), 
    Title (указать Field name - Title), 
    Rich Text (указать Field name - Content, в качестве основного контента)

После добавления полей нажать "Save" в правой части шапки CMS.

Сразу можно добавить первый пост. Переходим в репозиторий
(после кнопки "Save" по стрелке назад в левой части шапки), заполнив поля нажимаем "Save", после чего "Publish" для
публикации.

## Получение данных с CMS

Для извлечения данных установить пакет gatsby-source-prismic.

    yarn add gatsby-source-prismic --save

Для использования env переменных установить dotenv

    yarn add dotenv --save-dev

В корне проекта создаем файл .env со следующим содержимым:

    API_KEY=<Access Token>

где API_KEY - токен доступа для репозитория в prismic.io, который нужно сгенерировать в разделе репозитория "Settings" (
внизу левого сайдбара), далее "API & Security", внизу "Generate an Access Token", указать "Application name"
и нажать "Add this application", скопировать токен из "Access to master".

## Редактировать gatsby-config.js

Вверху файла первой строкой подключить dotenv

    require('dotenv').config({path: '.env'})

В раздел "plugins" добавить

        {
            resolve: 'gatsby-source-prismic',
                options: {
                    repositoryName: 'pawel-develop',
                    accessToken: `${process.env.API_KEY}`,
                    linkResolver: ({ node, key, value}) => post => `/${post.uid}`,
                    schemas: {
                post: require('./custom_types/post.json')
                }
            }
        }

где "repositoryName" - имя репозитория в CMS Prismic.

## Добавить файл кастомных типов в проект

В корне проекта создать папку custom_types и в ней файл post.json.

Для упрощения заполнения файла post.json перейдите https://prismic.io/ в репозиторий своего проекта, выберите "Custom
Types", далее необходимый тип, и в правом сайдбаре выберите "JSON editor", скопируйте содержимое и вставьте в post.json

    {
        "Main" : {
            "uid" : {
                "type" : "UID",
                "config" : {
                    "label" : "uid"
                }
            },
            "content" : {
                "type" : "StructuredText",
                "config" : {
                    "multi" : "paragraph,preformatted,heading1,heading2,heading3,heading4,heading5,heading6,strong,em,hyperlink,image,embed,list-item,o-list-item,rtl",
                    "label" : "Content"
                }
            },
            "title" : {
                "type" : "StructuredText",
                "config" : {
                    "single" : "heading1,heading2,heading3,heading4,heading5,heading6",
                     "label" : "Title"
                }
             }
        }
    }

## Запросы graphql

Для формирования запросов graphql перейдите, при запущенном проекте в режиме разработки, по

    http://localhost:8000/___graphql

Откройте allPrismicPost/edges/node выберите чекбокс uid

Откройте allPrismicPost/edges/node/data/content и выберите чекбокс html

Откройте allPrismicPost/edges/node/data/title и выберите чекбокс text

## Отображение страницы блогов

В папке src/pages создайте файл blog.js

    import React from "react";
    import Layout from "../components/layout";
    import Seo from "../components/seo";
    import {graphql, Link} from "gatsby";
    
    const BlogPage = ({data}) => (
    <Layout>
        <Seo title={'Blog'}/>
        <h1>Blog page</h1>
        {data.allPrismicPost.edges.map(post => {
            return <div key={post.node.uid}>
                <h3>{post.node.data.title.text}</h3>
                <br/>
                <Link to={`${post.node.uid}`}>Открыть</Link>
            </div>
        })}
    </Layout>
    )
    
    export const pageQuery = graphql`
    query PostsQuery {
        allPrismicPost {
            edges {
                node {
                    data {
                        title {
                            text
                        }
                    }
                uid
                }
            }
        }
    }
    `
    
    export default BlogPage

Тело запроса graphql можно скопировать из http://localhost:8000/___graphql,
из отмеченных ранее полей.

## Генерация страниц с подробной информацией поста

В папке src создайте папку "templates", в ней создайте файл "post.js" 
с содержимым:

    import React from "react";
    import Layout from "../components/layout";
    import {graphql, Link} from "gatsby";
    
    const Post = ({data}) => {
    if (!data) return null
    const post = data.prismicPost
    
        return (
            <Layout>
                <Link to={'/blog'}>Вернуться</Link>
                <hr/>
                <h1>{post.data.title.text}</h1>
                <div dangerouslySetInnerHTML={{__html: post.data.content.html}}/>
            </Layout>
        )
    }
    export const pageQuery = graphql`
        query PostByUid($uid: String!) {
            prismicPost(uid: {eq: $uid}) {
                uid
                data {
                    title {
                        text
                    }
                    content {
                        html
                    }
                }
            }
        }
    `
    export default Post

## Файл gatsby-node.js

В файл gatsby-node.js добавьте:

    exports.createPages = async ({ actions }) => {
        const { createPage } = actions
            createPage({
            path: "/using-dsg",
            component: require.resolve("./src/templates/using-dsg.js"),
            context: {},
            defer: true,
        })
    }
    
    const path = require("path")
    
    exports.createPages = async ({graphql, actions}) => {
        const { createPage } = actions
    
        const pages = await graphql(`
        {
            allPrismicPost {
                nodes {
                    id
                    uid
                }
            }
        }
        `)
    
        const template = path.resolve("src/templates/post.js")
        pages.data.allPrismicPost.nodes.forEach(post => {
            createPage({
                path: `/blog/${post.uid}`,
                component: template,
                context: {
                    uid: post.uid,
                }
            })
        })
    }

Где первый блок - пример генерации страницы, второй блок - 
генерация страницы поста.

## Размещение на хостинге "Netlify"

Пройдите регистрацию и авторизацию на https://netlify.com

Создайте/добавьте новый сайт нажатием на "Add new site" 
(import an existing project), выберите соответственно GitHub, GitLab или Bitbucket, 
пройдя авторизацию с гит, выберите репозиторий, ветку, укажите команду запуска билда.

Для добавления токена доступа нажмите "Show advanced", далее "New variable"
и в соответствии с переменой в .env заполните поля, для завершения нажмите 
"Deploy site".


## Вебхуки для ребилда

В https://netlify.com в разделе "Sites" выберите свой сайт, 
далее "Site settings", раздел "Build & deploy", в разделе "Build hooks"
нажмите "Add build hook".

Укажите имя вебхука и нажмите "Save". Скопируйте сгенерированную ссылку 
вебхука, чтобы далее вставить ее в CMS Prismic.


Перейдите в свой репозиторий в https://prismic.io/, далее раздел 
"Settings", далее "Webhooks" и "Create a webhook". 
Заполните необходимые поля:

Name of the Webhook - название вебхука

URL - URL, скопированный из "Netlify" 

и нажмите "Add this webhook".


## Заключение

При каждой публикации поста в Prismic, а также при обновлении кода 
в ветке гита, в "netlify" будет происходить ребилд, при этом 
во время перебилда старая версия сайта будет доступна.