--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, email, password, full_name, tera_id, username) FROM stdin;
2	ferinmtk@gmail.com	$2b$10$PY.5h8oeOx6XX6qXAjJ6euraaaXyTCXvB1.nOU0j7AMysvk9vkYIS	\N	1	temp_username
3	waemamary9@gmail.com	$2b$10$E9eXxmrqY5Ie7rjPFubRg.PrSkAM6l9zPUdqpP2j.iGvbT./.W99W	\N	2	temp_username
4	waemam9@gmail.com	$2b$10$mI126Br7OSqTvYqZ0ufQA.CGNLuLuLQ4VODYQjVsKAaGoBpLMn6D6	\N	3	temp_username
5	ferrrinmtk@gmail.com	$2b$10$BGk4cmveMs0tVMPGZVqAt..FrL0uZRIHwd1nunaxksD6fAzWgFAZu	\N	4	temp_username
7	43@gmail.com	$2b$10$VTbBzA2TlttS3lcDrgLcxetDdV.u2EaBHIZCqhRofq/BcWgLQCbj2	admin	\N	admin
8	5@gmail.com	$2b$10$1eKuL/g.04oK48ZXhLO27e20TlHl46UVEqZ1hcv7zJI2BJvPVpcce	admin	\N	ferin
9	kalembaprince01@gmail.com	$2b$10$z83BXsx0DrA7a0S0t0A0xeQU9nckPlgfegEAXqKUxef21ieo2nbla	ferin	\N	manciti
10	ferrinmtk@gmail.com	$2b$10$Fm1aS28aJ6JhZlaQ8KgPWeD3R.WAsf.zid2u/l98T9bvl2DNqiO/O	Mutuku	\N	ferinmtk
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	authentication	admin
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add admin	7	add_admin
26	Can change admin	7	change_admin
27	Can delete admin	7	delete_admin
28	Can view admin	7	view_admin
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authentication_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication_admin (id, last_login, is_superuser, first_name, middle_name, username, age, country, phone_number, email, password, is_active, is_staff) FROM stdin;
\.


--
-- Data for Name: authentication_admin_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication_admin_groups (id, admin_id, group_id) FROM stdin;
\.


--
-- Data for Name: authentication_admin_user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authentication_admin_user_permissions (id, admin_id, permission_id) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, full_name, username, email, password, created_at, updated_at, is_active) FROM stdin;
1	admin	admin	5@gmail.com	$2b$10$Ivrqmj5WY3kEMTu0T/BPs.pGLQOo0O0UaHbALmITqZmGtfWxGzG6i	2025-02-06 18:46:40.882924	2025-02-06 18:46:40.882924	t
8	John 	jonte	54@gmail.com	$2b$10$IVA3QGfdvl7X758pzH7WeOi6ytbb3UuHtNrZAc3ln2NmwWJH7JbD.	2025-02-12 14:19:00.791617	2025-02-12 14:19:00.791617	t
10	Linda Mutuku	Lindsey	jarnicelinda@gmail.com	$2b$10$RPfLCLmlEF9wzh4lrvWmsebg5yIN75iJtMk18pWouviCbB6q..EMq	2025-02-13 02:45:23.672112	2025-02-13 02:45:23.672112	t
11	Cynthia	Ndindu	cynthia@gmail.com	$2b$10$TFj3snmyD5dI/F.pVC67wuTXKoECKvRX7PixFpa7oklfeUet16u06	2025-02-14 04:33:34.28559	2025-02-14 04:33:34.28559	t
12	John KImani	jkim	jkim1@gmail.com	$2b$10$MLzxDOSzZImPKQS.2VBO6.jTiXTiWtQka6KLUrmsKam0zXS/RhIDW	2025-02-14 04:43:12.250023	2025-02-14 04:43:12.250023	t
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2025-02-04 03:05:48.971738+03
2	auth	0001_initial	2025-02-04 03:05:49.057971+03
3	admin	0001_initial	2025-02-04 03:05:49.085531+03
4	admin	0002_logentry_remove_auto_add	2025-02-04 03:05:49.093865+03
5	admin	0003_logentry_add_action_flag_choices	2025-02-04 03:05:49.103988+03
6	contenttypes	0002_remove_content_type_name	2025-02-04 03:05:49.122889+03
7	auth	0002_alter_permission_name_max_length	2025-02-04 03:05:49.133041+03
8	auth	0003_alter_user_email_max_length	2025-02-04 03:05:49.141783+03
9	auth	0004_alter_user_username_opts	2025-02-04 03:05:49.156037+03
10	auth	0005_alter_user_last_login_null	2025-02-04 03:05:49.165579+03
11	auth	0006_require_contenttypes_0002	2025-02-04 03:05:49.168044+03
12	auth	0007_alter_validators_add_error_messages	2025-02-04 03:05:49.17806+03
13	auth	0008_alter_user_username_max_length	2025-02-04 03:05:49.191402+03
14	auth	0009_alter_user_last_name_max_length	2025-02-04 03:05:49.201162+03
15	auth	0010_alter_group_name_max_length	2025-02-04 03:05:49.214161+03
16	auth	0011_update_proxy_permissions	2025-02-04 03:05:49.224399+03
17	auth	0012_alter_user_first_name_max_length	2025-02-04 03:05:49.234162+03
18	sessions	0001_initial	2025-02-04 03:05:49.252209+03
19	authentication	0001_initial	2025-02-04 03:42:47.816169+03
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, date, category, amount) FROM stdin;
1	2024-02-01	Land Costs	500.00
2	2024-02-02	Staff Payments	700.00
3	2024-02-03	Fertilizers	300.00
4	2024-02-04	Machinery Maintenance	400.00
5	2024-02-05	Transportation	200.00
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, product_name, quantity, daily_sales, unit_price, created_at) FROM stdin;
1	Goat Meat	120	4	12500.75	2025-02-14 06:15:37.508122
2	Goat Milk	300	10	9800.30	2025-02-14 06:15:37.508122
3	Broiler Chicken	200	7	15000.00	2025-02-14 06:15:37.508122
4	Eggs	500	20	17500.50	2025-02-14 06:15:37.508122
5	Live Catfish	150	5	16000.20	2025-02-14 06:15:37.508122
6	Smoked Catfish	100	3	14000.40	2025-02-14 06:15:37.508122
7	Raw Plantains	250	8	20000.60	2025-02-14 06:15:37.508122
8	Plantain Chips	180	6	13500.30	2025-02-14 06:15:37.508122
9	Fresh Corn	400	15	22000.00	2025-02-14 06:15:37.508122
10	Corn Flour	200	7	17000.80	2025-02-14 06:15:37.508122
11	Cassava Tubers	300	10	19500.20	2025-02-14 06:15:37.508122
12	Garri	250	8	20500.75	2025-02-14 06:15:37.508122
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, category, region, sales, profit, created_at, image_url) FROM stdin;
6	Smoked Catfish	CatFish Farming	south	500	14000.40	2025-02-12 06:42:19.031096	\N
8	Plantain Chips	Plantain Farming	south	650	13500.30	2025-02-12 06:42:19.031096	\N
3	Broiler Chicken	Chicken Farming	north	600	15000.00	2025-02-12 06:42:19.031096	/images/turkey.jpg
7	Raw Plantains	Plantain Farming	north	900	20000.60	2025-02-12 06:42:19.031096	/images/planatain.jpg
5	Live Catfish	CatFish Farming	north	700	16000.20	2025-02-12 06:42:19.031096	/images/catfish.jpg
12	Garri	Cassava Farming	south	901	20500.75	2025-02-12 06:42:19.031096	/images/Garri.jpg
1	Goat Meat	Goat Farming	north	450	12500.75	2025-02-12 06:42:19.031096	/images/goat.jpg
11	Cassava Tubers	Cassava Farming	north	802	19500.20	2025-02-12 06:42:19.031096	\N
9	Fresh Corn	Corn Farming	north	1001	22000.00	2025-02-12 06:42:19.031096	/images/fresh_corn.jpg
10	Corn Flour	Corn Farming	south	702	17000.80	2025-02-12 06:42:19.031096	\N
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, date, product, amount) FROM stdin;
1	2024-02-01	Cocoa	1500.00
2	2024-02-02	Plantains	800.00
3	2024-02-03	Cocoa	1700.00
4	2024-02-04	Plantains	900.00
5	2024-02-05	Cocoa	1600.00
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 10, true);


--
-- Name: admins_tera_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_tera_id_seq', 4, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 28, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: authentication_admin_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authentication_admin_groups_id_seq', 1, false);


--
-- Name: authentication_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authentication_admin_id_seq', 1, false);


--
-- Name: authentication_admin_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.authentication_admin_user_permissions_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 15, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 7, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 19, true);


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.expenses_id_seq', 5, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 12, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 12, true);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

