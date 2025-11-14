"use client";
import Link from "next/link";
import styles from "./BackButton.module.css";

interface BackButtonProps {
	path: string;
	title: string;
}
export default function BackButton({ path, title }: BackButtonProps) {
	return (
		<Link href={path}>
			<button className={styles.backButton} >
				← {title}
			</button>
		</Link>
	);
}
