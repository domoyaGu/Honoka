package com.leetCode;

public class Test62 {
    public static void main(String[] args) {
        System.out.println(sumNums(5));
    }

    public static int sumNums(int n) {
        boolean flag = n > 0 && (n += sumNums(n - 1)) > 0;
        return n;
    }
}
