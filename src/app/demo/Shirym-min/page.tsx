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
    const [isDarkMode, setIsDarkMode] = useState(false);




    const [lang, changelang] = useState<number>(0);
    {/* 基本JSONから抽出しています。変更をしやすくするのと、言語変更処理が楽なためです。 */ }
    return (


        <div className={style.page} key={1}>
            <header className={style.header}>
                <h1 className={style.name}>{data.name}</h1>
                <div className={style.langbutton}>
                    <button className={style.changelanguage} onClick={() => changelang(0)}>
                        Japanese  /
                    </button>

                    <button className={style.changelanguage} onClick={() => changelang(1)}>
                        English
                    </button>
                </div>
            </header>
            <hr className={style.mobileline}/>
            <div className={style.maincon}>
                {data.description[lang].map((info, idx) => {
                    return (
                        <p key={idx}>{info}</p>
                    )
                })}
                <div className={style.gridcontents}>
                    <div className={style.infoparent}>
                        <div className={style.infomations}>
                            <div className={style.link}>
                                <Link href={data.mygithub} target="_blank" rel="noopener noreferrer" className={style.a}>

                                    <Image className={style.image} src={data.imagesrc} width={200} height={200} alt={'Github Avater'} />
                                    <p>GitHub Link</p>



                                </Link>

                            </div>
                            <div>
                                <p className={style.info}>{data.term}</p>
                                <p className={style.info}>{data.birthday}</p>
                            </div>

                        </div>
                    </div>



                    {[0, 1, 2].map(n => {
                        return (
                            <div key={n}>
                                <h2 className={style.subtitle}>{data.subtitle[lang][n]}</h2>
                                {data.contents[lang][n].map((content, idx) => {
                                    return (
                                        <div className={style.contents} key={`${n}-${idx}`}>
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