# Supabase Database Schema

## Overview

This document provides detailed information about the Supabase database schema, including table structures, columns, data types, relationships, storage buckets, and additional configurations. It also includes specific instructions for handling images with the `product-images` storage bucket.

---

## Tables

### Customers Table

- **Description:** Stores customer information.
- **Table Name:** `Customers`
- **Columns:**

  | Column Name  | Data Type                | Is Nullable | Default Value     | Constraints        |
  | ------------ | ------------------------ | ----------- | ----------------- | ------------------ |
  | id           | `uuid`                   | NO          | `gen_random_uuid()` | Primary Key        |
  | name         | `text`                   | YES         |                   |                    |
  | email        | `text`                   | YES         |                   | Unique             |
  | company_name | `text`                   | YES         |                   | Unique             |
  | company_nui  | `text`                   | YES         |                   | Unique             |
  | phone        | `text`                   | YES         |                   |                    |
  | city         | `text`                   | YES         |                   |                    |
  | created_at   | `timestamp with time zone` | NO        | `now()`           |                    |

- **Indexes and Constraints:**
  - **Primary Key:** `id`
  - **Unique Constraints:**
    - `email`
    - `company_name`
    - `company_nui`
  - **Check Constraints:**
    - `2200_29278_1_not_null`
    - `2200_29278_8_not_null` (details unspecified)

---

### Orders Table

- **Description:** Records customer orders.
- **Table Name:** `Orders`
- **Columns:**

  | Column Name  | Data Type                | Is Nullable | Default Value             | Constraints        |
  | ------------ | ------------------------ | ----------- | ------------------------- | ------------------ |
  | id           | `uuid`                   | NO          | `gen_random_uuid()`       | Primary Key        |
  | customer_id  | `uuid`                   | YES         |                           | Foreign Key        |
  | product_id   | `uuid`                   | YES         |                           |                    |
  | quantity     | `integer`                | YES         |                           |                    |
  | package_size | `numeric`                | YES         |                           |                    |
  | order_status | `order_status` (enum)    | YES         | `'Submitted'::order_status` |                    |
  | created_at   | `timestamp with time zone` | NO        | `now()`                   |                    |
  | updated_at   | `timestamp with time zone` | YES       |                           |                    |
  | products     | `jsonb`                  | YES         |                           |                    |

- **Relationships:**
  - `customer_id` references `Customers.id` (Constraint name: `fk_customer_id`)
  - **Note:** There is no foreign key constraint on `product_id` according to the constraints result.

- **Indexes and Constraints:**
  - **Primary Key:** `id`
  - **Foreign Keys:**
    - `customer_id` → `Customers.id`
  - **Check Constraints:**
    - `2200_29221_1_not_null`
    - `2200_29221_7_not_null` (details unspecified)

- **Enumerations:**
  - **order_status:** `'Submitted'`, `'Processing'`, `'Paid'`, `'Shipped'`

- **Triggers and Functions:**
  - **Update Timestamp Function:**
    - A trigger `set_order_timestamp` calls the function `update_order_timestamp()` to automatically update `updated_at` before any update on the row.

---

### Products Table

- **Description:** Contains product details.
- **Table Name:** `Products`
- **Columns:**

  | Column Name  | Data Type                | Is Nullable | Default Value     | Constraints        |
  | ------------ | ------------------------ | ----------- | ----------------- | ------------------ |
  | id           | `uuid`                   | NO          | `gen_random_uuid()` | Primary Key        |
  | name         | `text`                   | YES         |                   |                    |
  | description  | `text`                   | YES         |                   |                    |
  | price        | `numeric`                | YES         |                   |                    |
  | image_url    | `text`                   | YES         |                   |                    |
  | package_size | `numeric`                | YES         |                   | Check (positive)   |
  | created_at   | `timestamp with time zone` | NO        | `now()`           |                    |
  | updated_at   | `timestamp with time zone` | YES       |                   |                    |

- **Indexes and Constraints:**
  - **Primary Key:** `id`
  - **Check Constraints:**
    - `2200_29142_1_not_null`
    - `2200_29142_6_not_null` (details unspecified)
    - `check_positive_package_size` (ensures `package_size` is positive)

- **Enumerations:**
  - **Note:** The `product_status` enum is no longer present according to the latest schema.

- **Triggers and Functions:**
  - **Update Timestamp Function:**
    - A trigger `set_timestamp` calls the function `update_timestamp()` to automatically update `updated_at` before any update on the row.

---

## Relationships

- **Orders Table:**
  - `customer_id` references `Customers.id` (Constraint name: `fk_customer_id`)
  - **Note:** No foreign key constraint on `product_id` is present according to the constraints result.

---

## Storage Buckets

### product-images

- **Description:** Supabase storage bucket for storing product images.
- **Bucket Name:** `product-images`

- **Image Handling Instructions:**

  - **Uploading Images:**
    - Use the Supabase Storage API to upload images to the `product-images` bucket.
    - Images should be stored in a structured path, e.g., `public/{product_id}/{original_file_name}`.

  - **File Naming Convention:**
    - Use unique file names to avoid collisions, preferably including the product ID or a UUID.
    - Example: `public/{product_id}/{original_file_name}`

  - **Updating `image_url`:**
    - After uploading an image, update the `image_url` field in the `Products` table with the public URL of the uploaded image.
    - Obtain the public URL using the Supabase Storage API's `getPublicUrl` method.

  - **Image Retrieval:**
    - When fetching products, use the `image_url` field to display the product images.

  - **Image Deletion:**
    - When a product is deleted, delete the associated image from the storage bucket to free up space.

  - **Security and Access:**
    - Ensure that the bucket's policies allow read access to images for displaying on the website.
    - Write access should be restricted to authenticated admin users.

  - **Image Formats and Sizes:**
    - Accepted image formats: JPEG, PNG.
    - Recommended image dimensions: Optimize for web display (e.g., 800x800 pixels).
    - Implement image resizing or compression if necessary to improve performance.

---

## Supabase Policies

- **Authentication:**
  - Using Supabase Authentication with only one user (admin).

- **Row-Level Security (RLS) Policies:**

  - **Customers Table:**
    - `SELECT`: Allow admin read access to customers (applied to `authenticated` role).
    - `ALL`: Allow public insert and update to customers (applied to `public` role).

  - **Orders Table:**
    - `SELECT`: Allow admin read access to orders (applied to `authenticated` role).
    - `INSERT`: Allow public insert to orders (applied to `public` role).

  - **Products Table:**
    - `ALL`: Allow admin full access to products (applied to `authenticated` role).
    - `SELECT`: Allow public read access to products (applied to `public` role).

- **Storage Bucket Policies:**
  - **product-images Bucket:**
    - **Read Access:** Public (or set appropriate policies to allow images to be displayed on the site).
    - **Write Access:** Restricted to authenticated admin users.

---

## Enums and Custom Types

- **order_status (Enum):**
  - Possible values:
    - `'Submitted'`
    - `'Processing'`
    - `'Paid'`
    - `'Shipped'`

- **product_status (Enum):**
  - **Note:** The `product_status` enum is no longer present according to the latest schema.

---

## Functions and Triggers

- **Update Timestamp Functions:**

  - **Function:** `update_order_timestamp()`

    ```sql
    CREATE OR REPLACE FUNCTION public.update_order_timestamp()
     RETURNS trigger
     LANGUAGE plpgsql
    AS $function$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $function$
    ```

    - **Trigger:** `set_order_timestamp`
      - **Table:** `Orders`
      - **Event:** `BEFORE UPDATE`
      - **Action:** Calls `update_order_timestamp()` to update `updated_at` before any update on a row.

  - **Function:** `update_timestamp()`

    ```sql
    CREATE OR REPLACE FUNCTION public.update_timestamp()
     RETURNS trigger
     LANGUAGE plpgsql
    AS $function$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $function$
    ```

    - **Trigger:** `set_timestamp`
      - **Table:** `Products`
      - **Event:** `BEFORE UPDATE`
      - **Action:** Calls `update_timestamp()` to update `updated_at` before any update on a row.

---

## Supabase Client Configuration

- **File Location:** `/lib/supabaseClient.ts`

- **Configuration:**
  - Initialize the Supabase client using the Supabase URL and public API key.
  - Store the Supabase URL and API key in environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

...

## TypeScript Interfaces

The TypeScript interfaces for the Supabase tables are defined in the `types/supabase.ts` file.

- **File Location:** `/types/supabase.ts`
- **Description:** Defines interfaces for `Customer`, `Order`, and `Product` entities for type safety throughout the application.

## Common Queries and Mutations

Common queries and mutations for interacting with Supabase are implemented in the `lib/supabaseQueries.ts` file.

- **File Location:** `/lib/supabaseQueries.ts`
- **Description:** Contains functions for data fetching and mutations, such as fetching all products, fetching a product by ID, updating a product, uploading product images, and fetching orders with related data.

...
- **Example Initialization:**

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);