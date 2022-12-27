// Test words from 'wordlist.txt', outputs valid ones into 'output.txt'
package main

import (
    "bufio"
    "log"
    "io/ioutil"
    "net/http"
    "net/url"
    "os"
)

const unknownStr = "{\"error\":"
const unknownErr = "{\"error\":\"I don't know the word "
const unknownWord= "\"I don't know this word.\""

func sendWord(word string) string {
    resp, err := http.PostForm("https://cemantle.certitudes.org/score",
                                url.Values{ "word": {word} })
    if err != nil {
        log.Fatal(word, err, resp)
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatal(word, err, body)
    }
    return string(body)
}

func checkWords(pathname string) {
    file, err := os.Open(pathname)
    if err != nil {
        panic(err)
    }
    defer file.Close()
    outputFile, err := os.OpenFile("output.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        panic(err)
    }
    defer outputFile.Close()
    scanner := bufio.NewScanner(file)
    for scanner.Scan() {
	    ret := sendWord(scanner.Text())
        if len(ret) > len(unknownStr) && ret[0:len(unknownStr)] == unknownStr {
            if len(ret)>len(unknownErr) && ret[0:len(unknownErr)]==unknownErr {
            } else {
                log.Fatal(scanner.Text(), ret)
            }
        } else {
		    if len(ret) > len(unknownWord) && ret[0:len(unknownWord)] == unknownWord {
            } else {
                outputFile.WriteString(scanner.Text() + "\n")
            }
        }
        if err := scanner.Err(); err != nil {
            log.Fatal(scanner.Text(), err)
        }
    }
}

func main() {
    checkWords("../wordlist.txt")
}
