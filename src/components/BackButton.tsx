"use client";
import { useRouter } from "next/navigation";
import styles from "./BackButton.module.css";

interface BackButtonProps {
	path: string;
	title: string;
}
export default function BackButton({ path, title }: BackButtonProps) {
	const router = useRouter();
	return (
		<button onClick={() => router.push(path)} className={styles.backButton} >
			← {title}
		</button>
	);
}
