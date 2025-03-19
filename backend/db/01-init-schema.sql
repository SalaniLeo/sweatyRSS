--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: 
--

CREATE TABLE public.admins (
    id uuid NOT NULL
);


ALTER TABLE public.admins OWNER TO ;

--
-- Name: feeds; Type: TABLE; Schema: public; Owner: 
--

CREATE TABLE public.feeds (
    feed_url text NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    feed_id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.feeds OWNER TO ;

--
-- Name: read_elements; Type: TABLE; Schema: public; Owner: 
--

CREATE TABLE public.read_elements (
    guid text NOT NULL,
    feed_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: development
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(128) NOT NULL,
    email character varying(255) UNIQUE NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: feeds feeds_pkey; Type: CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.feeds
    ADD CONSTRAINT feeds_pkey PRIMARY KEY (id);


--
-- Name: read_elements read_elements_pkey; Type: CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.read_elements
    ADD CONSTRAINT read_elements_pkey PRIMARY KEY (guid);


--
-- Name: feeds unique_feed_per_user; Type: CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.feeds
    ADD CONSTRAINT unique_feed_per_user UNIQUE (feed_url, user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: development
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: admins admins_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: feeds feeds_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.feeds
    ADD CONSTRAINT feeds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: read_elements read_elements_feed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.read_elements
    ADD CONSTRAINT read_elements_feed_id_fkey FOREIGN KEY (feed_id) REFERENCES public.feeds(id) ON DELETE CASCADE;


--
-- Name: read_elements read_elements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: 
--

ALTER TABLE ONLY public.read_elements
    ADD CONSTRAINT read_elements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
