import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setIsCartOpen } from "../../store/cartSlice";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BurgerMenu from "./BurgerMenu";
import ShoppingCart from "./ShoppingCart";
import SearchPopup from "../Popups/SearchPopup";
import { useSession } from "next-auth/react";
import { fetchCart } from "../../store/cartSlice";

const Header = () => {
	const { data, status } = useSession();
	const dispatch = useDispatch();
	const router = useRouter();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const isCartOpen = useSelector((state) => state.cart.isCartOpen);
	const cartCount = useSelector((state) => state.cart.cart.length);
	const isAuthenticated = status === "authenticated" && data ? true : false;

	useEffect(() => {
		const anonymousUserUuid = localStorage.getItem("anonymousUserID");
		if (isAuthenticated) {
			dispatch(fetchCart({ userId: data.user.id, anonymousUserUuid: undefined }));
		} else if (!isAuthenticated && status !== "loading") {
			dispatch(fetchCart({ userId: undefined, anonymousUserUuid }));
		}
	}, [status]);

	return (
		<header>
			<div className={styles.header}>
				<Link href={"/"}>
					<div className={styles.logo}>
						<Image className={styles.logo_image} src="/logo.jpg" width={50} height={50} alt="mosimode logo picture" priority />
						<h3>Mosimode</h3>
					</div>
				</Link>
				<nav className={styles.list_nav}>
					<ul>
						<li>
							<Link className={router.pathname === "/" ? styles.active : ""} href="/">
								Home
							</Link>
						</li>
						<li className={styles.shop_list} onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
							<Link className={router.pathname === "/shop" ? styles.active : ""} href="/shop">
								Shop
							</Link>
							<div className={styles.dropdown_content}>
								{isDropdownOpen && (
									<ul>
										<li>
											<Link href="/shop?category=پیرهن">پیرهن</Link>
										</li>
										<li>
											<Link href="/shop?category=تیشرت">تیشرت</Link>
										</li>
										<li>
											<Link href="/shop?category=کاپشن">کاپشن</Link>
										</li>
										<li>
											<Link href="/shop?category=سویشرت">سویشرت</Link>
										</li>
									</ul>
								)}
							</div>
						</li>
						<li>
							<Link className={router.pathname === "/about" ? styles.active : ""} href="/about">
								About
							</Link>
						</li>
						<li>
							<Link className={router.pathname === "/contact" ? styles.active : ""} href="/contact">
								Contact
							</Link>
						</li>
						{status === "authenticated" && data !== null && (
							<li>
								<Link className={router.pathname === "/dashboard" ? styles.active : ""} href="/dashboard">
									Dashboard
								</Link>
							</li>
						)}
					</ul>
				</nav>
				<div className={styles.list_icon}>
					{status === "unauthenticated" && data === null && (
						<li>
							<Link href="/login">
								Login
								<PersonIcon />
							</Link>
						</li>
					)}
					{status === "authenticated" && data !== null && (
						<li>
							<Link href="/dashboard">
								<p className={styles.userName}>{data.user.username}</p>
								<PersonIcon />
							</Link>
						</li>
					)}
					<li onClick={() => setIsSearchOpen(true)}>
						<SearchIcon />
					</li>
					<li className={styles.shoppingIcon_li} onClick={() => dispatch(setIsCartOpen({}))}>
						{cartCount > 0 && <span>{cartCount}</span>}
						<ShoppingBasketIcon />
					</li>
					<li>
						<BurgerMenu />
					</li>
				</div>
			</div>
			{isCartOpen && <ShoppingCart />}
			{isSearchOpen && <SearchPopup setIsSearchOpen={setIsSearchOpen} />}
		</header>
	);
};

export default Header;
