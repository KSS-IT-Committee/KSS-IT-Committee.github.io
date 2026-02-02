"use client";
import Image from "next/image";
import style from "./min.module.css"
import data from "./mincontents.json"
import Link from "next/link"
import { useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";

// モバイル対応は後で行う

export default function Shirymmin() {
    const controls = useAnimationControls();
    {/*アニメーションの練習がしたかっただけ↓*/ }
    const textAnimation = {
        init: {
            scale: 10,
            color: "transparent",
            textShadow: "0 0 100px #333, 0 0 100px #333",
            opacity: 0,

        },
    };
    useEffect(() => {
        controls.start((i) => ({
            scale: 1,
            textShadow: [
                "0 0 90px #FFF, 0 0 90px #FFF",
                "0 0 3px #FFF, 0 0 3px #FFF",
                "0 0 0 #FFF",
            ],
            opacity: [0, 1, 1],
            transition: {
                ease: "easeOut",
                duration: 2,
                delay: i * 0.1,
            },
        }))
    })

    const [lang, changelang] = useState<number>(0);
    {/* 基本JSONから抽出しています。変更をしやすくするのと、言語変更処理が楽なためです。 */ }
    return (


        <div className={style.page}>
            <header className={style.header}>
                <h1 className={style.name}><motion.span custom={0} initial="init" animate={controls} variants={textAnimation}>{data.name}</motion.span></h1>
                <div className={style.langbutton}>
                    {/* おまけ程度の言語変更機能 */}
                    <button className={style.changelanguage} onClick={() => changelang(0)}>
                        Japanese  /
                    </button>

                    <button className={style.changelanguage} onClick={() => changelang(1)}>
                        English
                    </button>
                </div>
            </header>
            <div className={style.maincon}>
                {data.description[lang].map((info, idx) => (
                    <p key={`desc-${idx}`}>{info}</p>
                ))}
                <div className={style.gridcontents}>
                    <div className={style.infomations}>
                        <div className={style.link}>
                            <Link href={data.mygithub} target="_blank" rel="noopener noreferrer" className={style.a}>
                                <Image
                                  className={style.image}
                                  src={data.imagesrc}
                                  width={200}
                                  height={200}
                                  alt={`${data.name} GitHub avatar`}
                                />
                                <p>GitHub Link</p>

                            </Link>

                        </div>
                        <div>
                            <p className={style.info}>{data.term}</p>
                            <p className={style.info}>{data.birthday}</p>
                        </div>
                        
                    </div>
                    

                    {[0, 1, 2].map(n => {
                        return (
                            <div key={n}>
                                <h2 className={style.subtitle}>{data.subtitle[lang][n]}</h2>
                                {data.contents[lang][n].map(content => {
                                    return (
                                        <div key={`content-${n}-${lang}`} className={style.contents}>
                                            <p className={style.content}>{content}</p>
                                        </div>

                                    )
                                })}
                            </div>
                        )
                    })}

                </div>




            </div>



        </div>
    )
}