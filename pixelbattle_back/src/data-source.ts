import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { User } from './user/user.entity'
import { Field } from './field/field.entity'
import { Post } from './post/post.entity'
import { Category } from './category/category.entity'
import { PostCategory } from './post/post_category.entity'
import { Token } from './token/token.entity'
dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Field, Post, Category, PostCategory, Token],
    migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
    synchronize: false,
}

export default new DataSource(dataSourceOptions)